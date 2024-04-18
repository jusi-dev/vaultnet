// "use client"

import Image from "next/image";
import { BackgroundDrop } from "./background";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X } from "lucide-react";
import { StarFilled } from '@ant-design/icons'
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Metadata } from "next";
import SubscriptionCardFree from "./subscriptions/_components/subscriptioncardfree";
import SubscriptionCard from "./subscriptions/_components/subscriptioncard";

export const metadata: Metadata = {
  title: "VaultNet - Secure Swiss Storage",
};


export default function Home() {
  return (
    <main className="w-screen m-0 p-0 flex flex-col overflow-x-hidden">
      <div className="mx-auto w-screen flex flex-col items-center relative">
        <BackgroundDrop />
        {/* Hero Section */}
        <div className="flex items-center py-10 w-screen mx-auto z-20">
          <div className="flex flex-col items-center w-full overflow-x-hidden md:h-screen md:mt-16 gap-y-10 mx-6 md:mx-10 lg:mx-0">
            <div className="bg-white rounded-full p-10 drop-shadow-xl md:w-[17vw] w-[50vw]">
              <Image
                src="/logo-faultnet.png"
                width={0}
                height={0}
                alt="VaultNet"
                sizes="100%"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div className="flex flex-col gap-y-6">
              <h1 className="text-4xl lg:text-7xl text-gray-800 font-extrabold text-center">
                Swiss Precision for Your Data: <br />{" "}
                <span className="text-2xl lg:text-5xl">
                  Secure, Private, and as Solid as the Alps.
                </span>
              </h1>
              <p className="text-xl text-gray-500 text-center lg:text-2xl">
                Start storing your files securely in Switzerland, within a
                minute.
              </p>
            </div>
            <div className="flex md:flex-row flex-col md:gap-10 gap-6">
              <Button variant="orange" className="text-2xl" size={"landing"}>
                Get Started
              </Button>
              <Button variant="outline" className="text-2xl" size={"landing"}>
                Learn More <ArrowRight />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container flex flex-col items-center w-full mt-20 md:mt-44">
        <div>
          <p className="text-4xl text-center md:text-6xl text-gray-800 font-extrabold">
            Want to store your files securely?
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 md:gap-24 mt-12 md:mt-28">
          <div className="bg-red-100 flex flex-col text-red-700 rounded-lg p-8 md:p-12 w-full md:w-[30vw]">
            <p className="text-xl md:text-3xl font-bold">
              Other File Storage Providers
            </p>
            <div className="flex flex-col text-md md:text-xl md:font-semibold mt-6 md:mt-8">
              <ul>
                <li className="flex items-center gap-4">
                  <X />
                  Storing files in Switzerland
                </li>
                <li className="flex items-center gap-4">
                  <X />
                  High Durability of your Datas
                </li>
                <li className="flex items-center gap-4">
                  <X />
                  Easy managable organizations
                </li>
                <li className="flex items-center gap-4">
                  <X />
                  Lower costs per GB
                </li>
                <li className="flex items-center gap-4">
                  <X />
                  <p>No notice period</p>
                </li>
                <li className="flex items-center gap-4">
                  <X />
                  <p>No hidden costs</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-green-100 flex flex-col text-green-700 rounded-lg p-8 md:p-12 w-full md:w-[30vw]">
            <p className="text-xl md:text-3xl font-bold">
              Storing with VaultNet
            </p>
            <div className="flex flex-col text-md md:text-xl mt-6 md:mt-8 md:font-semibold">
              <ul>
                <li className="flex items-center gap-4">
                  <Check />
                  Storing files in Switzerland
                </li>
                <li className="flex items-center gap-4">
                  <Check />
                  High Durability of your Datas
                </li>
                <li className="flex items-center gap-4">
                  <Check />
                  Easy managable organizations
                </li>
                <li className="flex items-center gap-4">
                  <Check />
                  Lower costs per GB
                </li>
                <li className="flex items-center gap-4">
                  <Check />
                  <p>No notice period</p>
                </li>
                <li className="flex items-center gap-4">
                  <Check />
                  <p>No hidden costs</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Review */}
        <div className="container mt-28 md:mt-44">
          <div className="flex flex-col items-center md:mx-[20vw] gap-y-6">
            <div className="flex gap-2">
              <StarFilled style={{ color: "#f5c542", fontSize: "30px" }} />
              <StarFilled style={{ color: "#f5c542", fontSize: "30px" }} />
              <StarFilled style={{ color: "#f5c542", fontSize: "30px" }} />
              <StarFilled style={{ color: "#f5c542", fontSize: "30px" }} />
              <StarFilled style={{ color: "#f5c542", fontSize: "30px" }} />
            </div>
            <div>
              <p className="md:text-2xl text-gray-700 text-center">
                This is the easiest and best way to solve my storage problem! I
                don't even have to worry about the security of my files. So glad
                that there is a provider inside of Switzerland!
              </p>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Avatar className="w-14 h-14 md:w-20 md:h-20 ">
                <AvatarImage src="/avatar.jpg" />
              </Avatar>
              <div className="flex flex-col">
                <p className="text-lg md:text-xl text-gray-800 font-semibold">
                  John Doe
                </p>
                <p className="md:text-lg text-gray-600">CEO of Company X</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Short Explenation */}
      <div className="container flex flex-col items-center w-full mt-32 md:mt-52">
        <div className="w-full">
          <h2 className="text-3xl md:text-5xl text-gray-800 text-left font-extrabold">
            The #1 Swiss Storage Service
          </h2>
          <div className="mt-6 md:mt-24 flex flex-col md:flex-row">
            <Accordion type="single" collapsible className="md:w-[30vw]">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                  1. Create an Account
                </AccordionTrigger>
                <AccordionContent className="text-lg md:text-xl text-gray-600">
                  Create easily within a minute your account, and connect it
                  with other providers.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-xl md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                  2. Upload your first file
                </AccordionTrigger>
                <AccordionContent className="text-lg md:text-xl text-gray-600">
                  Create easily within a minute your account, and connect it
                  with other providers.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-xl md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                  3. Share files with your organization or friends!
                </AccordionTrigger>
                <AccordionContent className="text-lg md:text-xl text-gray-600">
                  Create an organization and invite your team members or
                  friends! Share files with them easily.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div>
              <AspectRatio ratio={16 / 9} className="">
                <div className="bg-gray-400">PlaceHolder Image</div>
              </AspectRatio>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="w-full mt-16 md:mt-52 bg-gray-100">
        <div className="container flex flex-col items-center mt-32 w-full">
          <div>
            <div>
              <div className="p-2 bg-lime-500 items-center rounded-3xl w-80 mx-auto">
                {" "}
                <p className="text-center text-gray-50 text-xs md:text-md">
                  🌷 Spring Sale - CHF 10 OFF 🌷
                </p>
              </div>
              <h2 className="text-3xl md:text-5xl text-gray-800 text-center mt-10 font-extrabold">
                Start storing your files <br />
                within Switzerland
              </h2>
              <p className="mt-2 md:mt-8 text-center text-gray-500 text-lg md:text-xl font-medium">
                The most flexible pricing system which you will ever encouter.{" "}
                <br />
                Don't pay ever again for storage which you don't need.{" "}
              </p>
            </div>
            <div className="flex container flex-col md:flex-row mt-10 md:mt-20 w-full gap-8">
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
                  additionalStoragePrice: 1.5,
                }}
              />
            </div>
          </div>

          {/* Review */}
          <div className="container mt-28 md:mt-44">
            <div className="flex flex-col items-center md:mx-[20vw] gap-y-6">
              <div className="flex gap-2">
                <StarFilled style={{ color: "#f5c542", fontSize: "30px" }} />
                <StarFilled style={{ color: "#f5c542", fontSize: "30px" }} />
                <StarFilled style={{ color: "#f5c542", fontSize: "30px" }} />
                <StarFilled style={{ color: "#f5c542", fontSize: "30px" }} />
                <StarFilled style={{ color: "#f5c542", fontSize: "30px" }} />
              </div>
              <div>
                <p className="md:text-2xl text-gray-700 text-center">
                  This is the easiest and best way to solve my storage problem!
                  I don't even have to worry about the security of my files. So
                  glad that there is a provider inside of Switzerland!
                </p>
              </div>
              <div className="flex flex-row gap-4 items-center">
                <Avatar className="w-14 h-14 md:w-20 md:h-20 ">
                  <AvatarImage src="/avatar.jpg" />
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-lg md:text-xl text-gray-800 font-semibold">
                    John Doe
                  </p>
                  <p className="md:text-lg text-gray-600">CEO of Company X</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}

          <div className="w-full flex flex-col md:flex-row mt-36 md:mt-52 pb-40 md:justify-between">
            <div>
              <h2 className="text-4xl md:text-5xl text-gray-800 text-left font-extrabold">
                FAQ
              </h2>
              <p className="mt-4 text-left text-orange-500 text-lg md:text-xl font-semibold">
                Frequently Asked Questions
              </p>
            </div>
            <div className="text-left mt-8 md:mt-0">
              <Accordion type="single" collapsible className="md:w-[35vw]">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-semibold md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                    Can I share files with non-users or people outside
                    Switzerland?
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    To access your files, the person needs to have an account
                    with VaultNet. You can share files with people outside of
                    Switzerland.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-semibold md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                    Is there a limit to the file size or storage capacity?
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    As long as the file size doesn't exceed your current plan,
                    there is no restriction of file size.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-semibold md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                    Do you offer any trial periods or money-back guarantees?
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    Every user has up to 50mb of free storage. If you are not
                    satisfied with our service, you can easily cancle your
                    current subscription.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-semibold md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                    What happens to my data if I decide to cancel my
                    subscription?
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    If you decide to cancel your subscription, you can still
                    access your files for 30 days. After that, your files will
                    be deleted.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg font-semibold md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                    How can I access my files?
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    You can access your files easily from everywhere over the
                    VaultNet WebApp.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-lg font-semibold md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                    What are the pricing plans available?
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    See all pricing plans{" "}
                    <span className="text-orange-500 underline cursor-pointer">
                      here.
                    </span>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger className="text-lg font-semibold md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                    How do the additional GB work?
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    If you want to use more storage in your current plan, you
                    can easily add additional GB to your plan. Either you
                    pre-pay the additional GB in advance, or they are billed
                    automatically at the end of the month.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger className="text-lg font-semibold md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                    I need a custom plan for my company
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    If you need a custom plan for your company, please contact
                    our support team at support@vaultnet.ch. We will find the
                    best solution for you.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="flex flex-col mt-52 pb-40 md:mx-20">
          <h2 className="text-4xl md:text-6xl text-gray-800 text-center mt-10 font-extrabold">
            Never be worried about your Data ever again. <br />
            Start using Vaultnet
          </h2>
        </div>
      </div>

      {/* Call To Action */}
    </main>
  );
}
