"use server";

import type { Stripe } from "stripe";

import { headers } from "next/headers";

import { CURRENCY } from '@/config'
import { formatAmountForStripe } from '@/utils/stripe-helpers'
import { stripe } from '@/lib/stripe'
import { currentUser } from "@clerk/nextjs";
import { getMe } from "../../convex/users";

const getUserId = async () => {
  const user = await currentUser();

  if (!user) {
    return '';
  }

  return user.id;
}

export async function createCheckoutSession(
    data: FormData,
  ): Promise<{ client_secret: string | null; url: string | null }> {
    const ui_mode = data.get(
      "uiMode",
    ) as Stripe.Checkout.SessionCreateParams.UiMode;
  
    const origin: string = headers().get("origin") as string;
  
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        allow_promotion_codes: true,
        billing_address_collection: "required",
        mode: "subscription",
        // submit_type: "pay",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: CURRENCY,
              product_data: {
                name: "VaultNet Subscription",
              },
              unit_amount: formatAmountForStripe(
                Number(data.get("customDonation") as string),
                CURRENCY,
              ),
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
          success_url: `${origin}/donate-with-checkout/result?session_id={CHECKOUT_SESSION_ID}`,
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