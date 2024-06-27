import type { Metadata } from "next";

import CheckoutForm from "./_components/checkoutform";
import SubscriptionCard from "./_components/subscriptioncard";
import SubscriptionCardFree from "./_components/subscriptioncardfree";

export const metadata: Metadata = {
  title: "Subscriptions | VaultNet",
};


export default function DonatePage(): JSX.Element {
  return (
    <div className="container flex flex-col w-full items-center justify-center mx-auto my-32">
      <div className="p-2 bg-yellow-500 items-center rounded-3xl w-80 mx-auto mb-10">
        {" "}
        <p className="text-center text-gray-50 text-md md:text-lg">
          ☀️ Summer Sale - UP TO 35% OFF ☀️
        </p>
      </div>
      <h1 className="text-3xl md:text-5xl text-gray-800 text-center font-extrabold">
        Choose your VaultNet subscription
      </h1>
      <p className="text-center text-gray-500 mt-2">
        Choose the subscription that fits your needs
      </p>
      <div className="flex flex-col md:flex-row mt-10 md:mt-12 md:container w-[90%] md:w-full gap-8">
        <SubscriptionCardFree />
        <SubscriptionCard
          subscription="Vault L"
          price={1500}
          topChoice={true}
          shortDesc="Most popular choice for KMUs"
          subPerks={{
            storageSize: 250,
            members: "Unlimited",
            additionalStoragePrice: 0.50,
          }}
          orgPrice="20"
        />
        <SubscriptionCard
          subscription="Vault S"
          price={1000}
          topChoice={false}
          shortDesc="The perfect solution for individuals"
          subPerks={{
            storageSize: 200,
            members: "Up to 5",
            additionalStoragePrice: 1,
          }}
          orgPrice="15"
        />
      </div>
    </div>
  );
}