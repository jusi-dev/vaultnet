"use server";

import type { Stripe } from "stripe";

import { headers } from "next/headers";

import { CURRENCY } from '@/config'
import { formatAmountForStripe } from '@/utils/stripe-helpers'
import { stripe } from '@/lib/stripe'
import { currentUser } from "@clerk/nextjs";
import { getMe } from "../../convex/users";
import { getSubscriptionStorage, getUserById, updateSubscription } from "./aws/users";

const getUserId = async () => {
  const user = await currentUser();

  if (!user) {
    return '';
  }

  return user.id;
}

export async function createCheckoutSession(
    data: FormData, subscriptionType: string
  ): Promise<{ client_secret: string | null; url: string | null }> {
    const ui_mode = data.get(
      "uiMode",
    ) as Stripe.Checkout.SessionCreateParams.UiMode;
  
    const origin: string = headers().get("origin") as string;

    const subscriptionDetails = await getSubscriptionStorage(subscriptionType)
  
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        allow_promotion_codes: true,
        billing_address_collection: "required",
        mode: "subscription",
        metadata: {
          userId: await getUserId(),
        },
        // submit_type: "pay",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: CURRENCY,
              product_data: {
                name: "VaultNet Subscription Plan: " + subscriptionType,
              },
              unit_amount: subscriptionDetails.price,
              recurring: {
                interval: "month",
              },
            },
          },
        ],
        subscription_data: {
          metadata: {
            userId: await getUserId(),
          }
        },
        ...(ui_mode === "hosted" && {
          success_url: `${origin}/subscriptions/success`,
          cancel_url: `${origin}/donate-with-checkout`,
        }),
        ...(ui_mode === "embedded" && {
          return_url: `${origin}/donate-with-embedded-checkout/result?session_id={CHECKOUT_SESSION_ID}`,
        }),
        ui_mode,
      });
  
    return {
      client_secret: checkoutSession.client_secret,
      url: checkoutSession.url,
    };
  }
  export const retriveSubID = async (userId: string) => {
    const subscription = await stripe.subscriptions.list({
      customer: userId,
    })


    const user = subscription.data[0].metadata?.userId
    const subscriptionId = subscription.data[0].id
    const customerId = subscription.data[0].customer

    return { user, subscriptionId, customerId }
  }

  export const changeSubscription = async (customerId: string, newSubscription: string) => {
    const subscription = await retriveSubID(customerId)

    const getNewSubscriptionStorage = await getSubscriptionStorage(newSubscription)
    const user = await getUserById(subscription.user)

    console.log("mbs uploaded: ", user.mbsUploaded)
    console.log("new subscription size: ", getNewSubscriptionStorage.size)
    console.log("Is bigger: ", user.mbsUploaded > getNewSubscriptionStorage.size)

    // if (user.mbsUploaded > getNewSubscriptionStorage.size && !user.payAsYouGo) {
    if (false) {
      return { error: 'User has exceeded storage limit', subscriptionLimit: (getNewSubscriptionStorage.size / (1024 * 1024)).toFixed(2)}
    } else {
      await updateSubscription(subscription.user, subscription.customerId as string, newSubscription, true)
      const status = await stripe.subscriptions.cancel(subscription.subscriptionId)
      return {status}
    }

  }