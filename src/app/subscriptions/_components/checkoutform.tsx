"use client";

import type Stripe from "stripe";

import React, { useState } from "react";

import { formatAmountForDisplay } from "@/utils/stripe-helpers";
import * as config from "@/config";
import { createCheckoutSession } from "@/actions/stripe";
import getStripe from "@/utils/get-stripejs";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

interface CheckoutFormProps {
  uiMode: Stripe.Checkout.SessionCreateParams.UiMode;
  subscriptionType: string;
}

export default function CheckoutForm(props: CheckoutFormProps): JSX.Element {

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  const user = useUser();

  const formAction = async (data: FormData): Promise<void> => {
    const uiMode = data.get(
      "uiMode",
    ) as Stripe.Checkout.SessionCreateParams.UiMode;
    const subscriptionType = props.subscriptionType;
    const { client_secret, url } = await createCheckoutSession(data, subscriptionType);

    if (uiMode === "embedded") return setClientSecret(client_secret);

    if (user) {
      window.location.assign(`https://accounts.vaultnet.ch/sign-up?redirect_url=${url}`);
    } else {
      window.location.assign(url as string);
    }


  };

  return (
    <>
      <form action={formAction}>
        <input type="hidden" name="uiMode" value={props.uiMode} />
        <Button variant="orange" className="text-2xl w-full cursor-pointer" size={"landing"} type="submit">
          Start Now
        </Button>
      </form>
      {/* {clientSecret ? (
        <EmbeddedCheckoutProvider
          stripe={getStripe()}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      ) : null} */}
    </>
  );
}