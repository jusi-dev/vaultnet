"use client";

import type Stripe from "stripe";

import React, { useState } from "react";

import { formatAmountForDisplay } from "@/utils/stripe-helpers";
import * as config from "@/config";
import { createCheckoutSession, enablePAYGCheckout } from "@/actions/stripe";
import { Button } from "@/components/ui/button";

interface CheckoutFormProps {
  uiMode: Stripe.Checkout.SessionCreateParams.UiMode;
  subscriptionType: string;
}

export default function PAYGForm(props: CheckoutFormProps): JSX.Element {

  const [loading] = useState<boolean>(false);
  const [input, setInput] = useState<{ customDonation: number }>({customDonation: 10});

  const formAction = async (data: FormData): Promise<void> => {
    const uiMode = data.get(
      "uiMode",
    ) as Stripe.Checkout.SessionCreateParams.UiMode;
    const subscriptionType = props.subscriptionType;
    const { client_secret, url } = await enablePAYGCheckout(data, subscriptionType);

    window.location.assign(url as string);
  };

  return (
    <>
      <form action={formAction}>
        <input type="hidden" name="uiMode" value={props.uiMode} />
        <Button variant={"orange"} type="submit" disabled={loading}>
          Enable Pay-As-You-Go
        </Button>
      </form>
    </>
  );
}