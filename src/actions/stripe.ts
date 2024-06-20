"use server";

import type { Stripe } from "stripe";

import { headers } from "next/headers";

import { CURRENCY } from '@/config'
// import { stripe } from '@/lib/stripe'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { currentUser } from "@clerk/nextjs";
import { cancelSubscription, disablePAYG, endPAYG, getSubscriptionStorage, getUserById, setPAYGIdentifier, updateSubscription } from "./aws/users";

const getUserId = async () => {
  const user = await currentUser();

  if (!user) {
    return '';
  }

  return user.id;
}

const priceIds = {
  'Vault S': process.env.STRIPE_VAULT_S_SUB,
  'Vault L': process.env.STRIPE_VAULT_L_SUB,
}

const PAYGPriceId = {
  "free": process.env.STRIPE_PAYG_FREE,
  'Vault S': process.env.STRIPE_PAYG_S,
  "Vault L": process.env.STRIPE_PAYG_L,
}

export async function createCheckoutSession( data: FormData, subscriptionType: string ) : Promise<{ client_secret: string | null; url: string | null }> {
    const ui_mode = data.get(
      "uiMode",
    ) as Stripe.Checkout.SessionCreateParams.UiMode;
  
    const origin: string = headers().get("origin") as string;

    const userId = await getUserId()
    const user = await getUserById(userId)
  
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        allow_promotion_codes: true,
        billing_address_collection: "required",
        mode: "subscription",
        metadata: {
          userId: await getUserId(),
          subscriptionType: subscriptionType
        },
        customer: user.customerId ? `${user.customerId}` : undefined,
        line_items: [
          {
            quantity: 1,
            price: priceIds[subscriptionType as keyof typeof priceIds],
          },
        ],
        subscription_data: {
          metadata: {
            userId: await getUserId(),
            subscriptionType: subscriptionType
          }
        },
        ...(ui_mode === "hosted" && {
          success_url: `${origin}/subscriptions/success`,
          cancel_url: `${origin}/subscriptions/failed`,
        }),
        ui_mode,
      });
  
    return {
      client_secret: checkoutSession.client_secret,
      url: checkoutSession.url,
    };
 }

 export async function enablePAYGCheckout( data: FormData, subscriptionType: string ) : Promise<{ client_secret: string | null; url: string | null }> {
  const ui_mode = data.get(
    "uiMode",
  ) as Stripe.Checkout.SessionCreateParams.UiMode;

  const origin: string = headers().get("origin") as string;

  const userId = await getUserId()
  const user = await getUserById(userId)

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      billing_address_collection: "required",
      mode: "subscription",
      metadata: {
        userId: await getUserId(),
        payg: true,
      },
      customer: user.customerId ? `${user.customerId}` : undefined,
      line_items: [
        {
          price: PAYGPriceId[user.subscriptionType as keyof typeof PAYGPriceId]
        },
      ],
      subscription_data: {
        metadata: {
          userId: await getUserId(),
          payg: true,
        }
      },
      ...(ui_mode === "hosted" && {
        success_url: `${origin}/dashboard/files`,
        cancel_url: `${origin}/subscriptions/failed`,
      }),
      ui_mode,
    });

  return {
    client_secret: checkoutSession.client_secret,
    url: checkoutSession.url,
  };
}

  const subscriptionIds = {
    'Vault S': 'price_1PIcbMIugTClj0cpBP2vZMjC',
    'Vault L': 'price_1PIcdgIugTClj0cptiNMHAt4',
  }

  export const retriveSubID = async (customerId: string, subscriptionType: string) => {
    const subscription = await stripe.subscriptions.list({
      customer: customerId,
    })

    console.log("This is the subscription data ", subscription.data)

    // Get SubscriptionID of the subscriptionType or PAYG Subscription

    if (subscriptionType === 'PAYG') {
      for (const sub of subscription.data) {
        if (sub.metadata?.payg === 'true') {
          return { subscriptionId: sub.id, customerId: sub.customer, user: sub.metadata?.userId, current_period_start: sub.current_period_start }
        }
      }
    } else {
      for (const sub of subscription.data) {
        if (sub.metadata?.subscriptionType === subscriptionType) {
          return { subscriptionId: sub.id, customerId: sub.customer, user: sub.metadata?.userId }
        }
      }
    }

    throw new Error('Subscription not found')
  }

export const changeSubscription = async (customerId: string, currentSubscription: string) => {
    const subscription = await retriveSubID(customerId, currentSubscription)

    const status = await stripe.subscriptions.update(subscription.subscriptionId, {
      cancel_at_period_end: true,
    });

    if (currentSubscription === 'PAYG') {
      await endPAYG(subscription.user, status.current_period_end)
    } else {
      await cancelSubscription(subscription.user, status.current_period_end)
    }

    return {status}
  }

const getStartOfCurrentSubscription = async (customerId: string, priceId: string) => {
  try {
    const subscription = await stripe.subscriptions.list({
      customer: customerId,
      price: priceId
    })

    console.log("Funny output", subscription.data[0].current_period_start)

    return subscription.data[0].current_period_start;
  } catch (err) {
    return;
  }
}

const getMeterUsage = async (customerId: string, subscriptionTime: string) => {
  try {

  const meterEventSummaries = await stripe.billing.meters.listEventSummaries(
    `mtr_test_61QQ1aUJ1J8CCX7Nr41IugTClj0cpE4O`,
    {
      customer: customerId,
      start_time: subscriptionTime,
      end_time: parseInt(subscriptionTime) + 1000,
    }
  );

  console.log("This is the usage: ", meterEventSummaries.data[0].aggregated_value)
  return meterEventSummaries.data[0].aggregated_value;
  } catch (err) {
    return 0;
  }
}

export const addToPAYG = async (customerId: string, mbs: string, userId: string) => {
  const subscription = await retriveSubID(customerId, 'PAYG')
  const userUsage = await getMeterUsage(customerId, subscription.current_period_start)

  const user = await getUserById(userId)

  console.log("This is the PAYG identifier", user.PAYGidentifier)

  if (userUsage <= parseInt(mbs) / 1024 / 1024 || !userUsage) {

    console.log("Running this part of code!")
    try {
      const meterEventAdjustment = await stripe.billing.meterEventAdjustments.create({
        cancel: {
          identifier: user.PAYGidentifier,
        },
        event_name: 'storage-pay_as_you_go',
        type: 'cancel',
      });
    } catch (err) {
      console.log(err)
    }

    console.log("Running this part of code PART 2!")
    console.log("This is the overused usage: ", mbs)
    console.log("This is the new usage to set: ", (parseInt(mbs) / 1024 / 1024).toFixed(0).toString())
    const createMeterEvent = await stripe.billing.meterEvents.create({
      event_name: 'storage-pay_as_you_go',
      payload: {
        value: ((parseInt(mbs) / 1024 / 1024).toFixed(0)).toString(),
        stripe_customer_id: customerId,
        action: 'set',
      },
      timestamp: subscription.current_period_start || 0
    })

    await setPAYGIdentifier(createMeterEvent.identifier, userId)
  }
}

export const cancelPAYG = async (userId: string) => {
  const user = await getUserById(userId)

  if (user.PAYGidentifier) {
    const meterEventAdjustment = await stripe.billing.meterEventAdjustments.create({
      cancel: {
        identifier: user.PAYGidentifier,
      },
      event_name: 'storage-pay_as_you_go',
      type: 'cancel',
    });
  }

  await disablePAYG(userId)
}