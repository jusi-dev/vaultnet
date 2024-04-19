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
import Link from "next/link";

export const metadata: Metadata = {
  title: "VaultNet - Secure Swiss Storage",
  description: "VaultNet is the most secure and flexible storage solution in Switzerland. Store your files securely and privately in the heart of the Swiss Alps.",
};


export default function Home() {
  return (
    <main className="w-screen m-0 p-0 flex flex-col overflow-x-hidden scroll-smooth">
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
                {/* Start storing your files securely in Switzerland, within a
                minute. */}
                Don't pay ever again for storage which you don't need!<br />Flexible, dynamic and extremely easy.
              </p>
            </div>
            <div className="flex md:flex-row flex-col md:gap-10 gap-6">
              <Link href="https://accounts.vaultnet.ch/sign-up">
                <Button variant="orange" className="text-2xl" size={"landing"}>
                  Get Started
                </Button>
              </Link>
              <Link href={"#learnMore"}>
                <Button variant="outline" className="text-2xl" size={"landing"}>
                  Learn More <ArrowRight />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container flex flex-col items-center w-full mt-20 md:mt-44 scroll-mt-20" id="learnMore">
        <div>
          <p className="text-4xl text-center md:text-6xl text-gray-800 font-extrabold">
            Want to store your files securely?
          </p>
          <p className="text-center text-gray-600 text-2xl mt-4">Compare why we are the top choice for you</p>
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
                {/* This is the easiest and best way to solve my storage problem! I
                don't even have to worry about the security of my files. So glad
                that there is a provider inside of Switzerland! */}

                I never liked the complexity or pricing models of other providers. 
                But with VaultNet I can easily manage my files and share them with my team members. 
                The best thing is the hybird pricing model. I only pay for what I use.
              </p>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <div
                className="w-14 h-14 md:w-20 md:h-20 bg-gray-400 rounded-full bg-[url('/jusi.jpg')] bg-cover bg-center"
              ></div>
              <div className="flex flex-col">
                <p className="text-lg md:text-xl text-gray-800 font-semibold">
                  Justin Winistörfer
                </p>
                <p className="md:text-lg text-gray-600">Owner of Winistörfer Webdesign</p>
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
          <p className="text-left text-gray-600 text-2xl mt-4">It was never easier to manage all your files in the cloud</p>
          <div className="mt-6 md:mt-24 flex flex-col md:flex-row">
            <Accordion type="single" collapsible className="md:w-[80vw]">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                  1. Create an Account
                </AccordionTrigger>
                <AccordionContent className="text-lg md:text-xl text-gray-600 flex flex-col">
                  <p className="text-left mb-4">Create easily within a minute your account, and connect it
                  with other providers.</p>

                  <div className="flex w-[80%]">
                    <AspectRatio ratio={16 / 9} className="flex w-full">
                      <Image src={"/vaultnet-create.gif"} alt="Create Account" layout="fill" objectFit="cover" />
                    </AspectRatio>
                  </div>
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

            {/* <div className="flex w-[80%]">
              <AspectRatio ratio={16 / 9} className="flex w-full">
                <Image src={"/vaultnet-create.gif"} alt="Create Account" layout="fill" objectFit="cover" />
              </AspectRatio>
            </div> */}
          </div>
        </div>
      </div>

      <div className="container flex flex-col items-center w-full mt-32 md:mt-60">
        <div className="w-full">
          <h2 className="text-5xl md:text-5xl text-gray-800 text-center font-extrabold">
            So many reasons <br/>to choose VaultNet
          </h2>
          <p className="text-center text-gray-600 text-2xl mt-4">And there are still many more to explore!</p>
          <div className="text-center flex flex-col md:flex-row items-center justify-center mt-12 md:mt-24 gap-20 gap-y-12">
            <div className="flex flex-col items-center md:w-[30%]">
              <p className="text-lg text-orange-500 font-semibold drop-shadow-lg">Up to</p>
              <p className="text-5xl text-orange-500 font-semibold drop-shadow-lg">99.999999999%</p>
              <p className="text-lg text-orange-500 font-semibold drop-shadow-lg">durability</p>
              <p className="mt-2 text-center">Unlock Unparalleled Endurance — Experience our 9-Nine Durability Standard that promises virtually perfect persistence, ensuring your data withstands the test of time with unwavering resilience.</p>
            </div>
            <div className="flex flex-col items-center md:w-[33%]">
              <p className="text-lg text-orange-500 font-semibold drop-shadow-lg">All files are stored</p>
              <p className="text-5xl text-orange-500 font-semibold drop-shadow-lg">within Switzerland</p>
              <p className="text-lg text-white font-semibold">.</p>
              <p className="mt-2 text-center">Swiss Sanctuary for Data — Benefit from the robust privacy laws and meticulous attention to detail with our exclusive Swiss storage solutions. Your data is not just stored; it’s fortified in the heart of Switzerland.</p>
            </div>
            <div className="flex flex-col items-center md:w-[30%]">
              <p className="text-lg text-orange-500 font-semibold drop-shadow-lg">Save money with the</p>
              <p className="text-5xl text-orange-500 font-semibold drop-shadow-lg">Pay-As-You-Go</p>
              <p className="text-lg text-orange-500 font-semibold drop-shadow-lg">hybrid pricing model.</p>
              <p className="mt-2 text-center">Economize Without Compromise — Embrace our Hybrid Pay-As-You-Go Model for a tailor-made pricing strategy that adapts to your usage. Spend less, save more, and enjoy the elasticity that your finances will thank you for.</p>
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

          <div className="w-full flex flex-col md:flex-row mt-36 md:mt-52 pb-40 md:justify-between scroll-mt-20" id="faq">
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
        <div className="flex flex-col mt-40 pb-40 md:mx-[20%] items-center">
          <h2 className="text-4xl md:text-5xl text-gray-700 text-center mt-10 font-extrabold">
            It was never easier to store your files so flexible and secure!<br/>
          </h2>
          <p className="mt-12 text-4xl md:text-5xl text-orange-500 text-center font-extrabold">Onboard on VaultNet in less than a minute.</p>
          <Link href="https://accounts.vaultnet.ch/sign-up" className="text-2xl mt-14 w-[50%] md:w-[30%]">
            <Button variant="orange" className="" size={"landing"}>
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* Call To Action */}
    </main>
  );
}
