import type { Metadata } from "next";

import CheckoutForm from "./_components/checkoutform";
import SubscriptionCard from "./_components/subscriptioncard";
import SubscriptionCardFree from "./_components/subscriptioncardfree";

export const metadata: Metadata = {
  title: "Subscriptions | VaultNet",
};


export default function DonatePage(): JSX.Element {
  return (
    <div className="page-container flex flex-col w-full items-center justify-center mx-auto">
      <h1 className="text-3xl md:text-5xl text-gray-800 text-center mt-10 font-extrabold">Choose your VaultNet subscription</h1>
      <p className="text-center text-gray-500 mt-2">Choose the subscription that fits your needs</p>
      <div className="flex flex-col md:flex-row gap-10 md:flex-wrap">
        <SubscriptionCardFree />
        <SubscriptionCard subscription="Vault L" price={1500} topChoice={true} shortDesc="Most popular choice for KMUs"/>
        <SubscriptionCard subscription="Vault S" price={1000} topChoice={false} shortDesc="The perfect solution for individuals" />
      </div>
    </div>
  );
}