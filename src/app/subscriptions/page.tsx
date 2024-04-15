import type { Metadata } from "next";

import CheckoutForm from "./_components/checkoutform";

export const metadata: Metadata = {
  title: "Donate with embedded Checkout | Next.js + TypeScript Example",
};

export default function DonatePage(): JSX.Element {
  return (
    <div className="page-container">
      <h1>Choose your subscription</h1>
      <CheckoutForm uiMode="hosted" />
    </div>
  );
}