"use client";

import type Stripe from "stripe";

import React, { useState } from "react";

import CustomDonationInput from "./customdonationinput";
import StripeTestCards from "./stripetestcards";

import { formatAmountForDisplay } from "@/utils/stripe-helpers";
import * as config from "@/config";
import { createCheckoutSession } from "@/actions/stripe";
import getStripe from "@/utils/get-stripejs";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { currentUser } from "@clerk/nextjs";
import { sub } from "date-fns";

interface CheckoutFormProps {
  uiMode: Stripe.Checkout.SessionCreateParams.UiMode;
  subscriptionType: string;
}

export default function CheckoutForm(props: CheckoutFormProps): JSX.Element {

  const [loading] = useState<boolean>(false);
  const [input, setInput] = useState<{ customDonation: number }>({customDonation: 10});
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const formAction = async (data: FormData): Promise<void> => {
    const uiMode = data.get(
      "uiMode",
    ) as Stripe.Checkout.SessionCreateParams.UiMode;
    const subscriptionType = props.subscriptionType;
    const { client_secret, url } = await createCheckoutSession(data, subscriptionType);

    if (uiMode === "embedded") return setClientSecret(client_secret);

    window.location.assign(url as string);
  };

  return (
    <>
      <form action={formAction}>
        <input type="hidden" name="uiMode" value={props.uiMode} />
        {/* <StripeTestCards /> */}
        <button
          className="checkout-style-background"
          type="submit"
          disabled={loading}
        >
          Donate {formatAmountForDisplay(input.customDonation, config.CURRENCY)}
        </button>
      </form>
      {clientSecret ? (
        <EmbeddedCheckoutProvider
          stripe={getStripe()}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      ) : null}
    </>
  );
}