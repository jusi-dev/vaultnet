import type { Metadata } from "next";

import CheckoutForm from "./_components/checkoutform";
import SubscriptionCard from "./_components/subscriptioncard";
import SubscriptionCardFree from "./_components/subscriptioncardfree";

export const metadata: Metadata = {
  title: "Subscriptions | VaultNet",
};


export default function DonatePage(): JSX.Element {
  return (
    <div className="container flex flex-col w-full items-center justify-center mx-auto my-20">
      <h1 className="text-3xl md:text-5xl text-gray-800 text-center font-extrabold">
        Choose your VaultNet subscription
      </h1>
      <p className="text-center text-gray-500 mt-2">
        Choose the subscription that fits your needs
      </p>
      <div className="flex flex-col w-full md:flex-row gap-10">
        <SubscriptionCardFree />
        <SubscriptionCard
          subscription="Vault L"
          price={1500}
          topChoice={true}
          shortDesc="Most popular choice for KMUs"
          subPerks={{
            storageSize: 250,
            members: "Unlimited",
            additionalStoragePrice: 1,
          }}
        />
        <SubscriptionCard
          subscription="Vault S"
          price={1000}
          topChoice={false}
          shortDesc="The perfect solution for individuals"
          subPerks={{
            storageSize: 200,
            members: "Up to 5",
            additionalStoragePrice: 1.50,
          }}
        />
      </div>
    </div>
  );
}