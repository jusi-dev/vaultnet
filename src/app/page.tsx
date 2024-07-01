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

export default function Home() {
  return (
    <main className="w-screen m-0 p-0 flex flex-col overflow-x-hidden scroll-smooth z-10">
      <div className="mx-auto w-screen flex flex-col items-center relative">
        <BackgroundDrop />
        {/* Hero Section */}
        <div className="flex items-center py-10 w-screen mx-auto z-20">
          <div className="flex flex-col items-center justify-center w-full overflow-x-hidden h-screen md:h-screen md:mt-16 gap-y-10 mx-6 md:mx-10 lg:mx-0">
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
                <Button variant="orange" className="text-2xl w-[100%]" size={"landing"}>
                  Get Started
                </Button>
              </Link>
              <Link href={"#learnMore"}>
                <Button variant="outline" className="text-2xl w-[100%]" size={"landing"}>
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
                className="w-12 h-12 md:w-20 md:h-20 bg-gray-400 rounded-full bg-[url('/jusi.jpg')] bg-cover bg-center"
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
                  <p className="text-left mb-4">Create easily within a minute your account, or connect VaultNet
                  with other providers.</p>

                  <div className="flex">
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
                <AccordionContent className="text-lg md:text-xl text-gray-600 flex flex-col">
                  <p className="text-left mb-4">Just click on "Upload File" and choose your file. It's really that easy!</p>

                  <div className="flex">
                    <AspectRatio ratio={16 / 9} className="flex w-full">
                      <Image src={"/vaultnet-upload.gif"} alt="Create Account" layout="fill" objectFit="cover" />
                    </AspectRatio>
                  </div>
                  
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-xl md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                  3. Share files with your family, friends or team members!
                </AccordionTrigger>
                <AccordionContent className="text-lg md:text-xl text-gray-600 flex flex-col">
                  <p className="text-left mb-4">The most convinient way to share files with everyone! Just create a shareable link and copy it.</p>

                  <div className="flex">
                    <AspectRatio ratio={16 / 9} className="flex w-full">
                      <Image src={"/vaultnet-share.gif"} alt="Create Account" layout="fill" objectFit="cover" />
                    </AspectRatio>
                  </div>
                  
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
          <div className="text-center flex flex-col md:flex-row items-center justify-center mt-12 md:mt-24 gap-20 gap-y-20 md:gap-y-12">
            <div className="flex flex-col items-center md:w-[30%]">
              <div className="h-28">
                <p className="text-lg text-orange-500 font-semibold drop-shadow-lg">Experience unmatched</p>
                <p className="text-5xl text-orange-500 font-semibold drop-shadow-lg">Durability</p>
                <p className="text-lg text-orange-500 font-semibold drop-shadow-lg">for ultimate reliability</p>
              </div>
              <p className="mt-2 text-center h-20">Unlock Unparalleled Endurance — Experience our 9-Nine Durability Standard that promises virtually perfect persistence, ensuring your data withstands the test of time with unwavering resilience.</p>
            </div>
            <div className="flex flex-col items-center md:w-[33%]">
              <div className="h-28">
                <p className="text-lg text-orange-500 font-semibold drop-shadow-lg">Easily</p>
                <p className="text-5xl text-orange-500 font-semibold drop-shadow-lg">collaborate</p>
                <p className="text-lg text-orange-500 font-semibold drop-shadow-lg">with your team</p>
              </div>
              <p className="mt-2 text-center h-20">Effortless Synergy — Collaborate with your team like never before. Share and edit files securely in real-time, ensuring everyone stays on the same page without compromising on privacy.</p>
            </div>
            <div className="flex flex-col items-center md:w-[30%]">
              <div className="h-40 md:h-28">
                <p className="text-lg text-orange-500 font-semibold drop-shadow-lg">Save money with the</p>
                <p className="text-5xl text-orange-500 font-semibold drop-shadow-lg">Pay-As-You-Go</p>
                <p className="text-lg text-orange-500 font-semibold drop-shadow-lg">hybrid pricing model.</p>
              </div>
              <p className="mt-2 text-center h-20">Economize Without Compromise — Embrace our Hybrid Pay-As-You-Go Model for a tailor-made pricing strategy that adapts to your usage. Spend less, save more, and enjoy the elasticity that your finances will thank you for.</p>
            </div>
          </div>
        </div>
      </div>


      <div className="container flex flex-col items-center w-full mt-32 md:mt-60 mb-20 md:mb-0">
        <div className="w-full">
          <h2 className="text-5xl md:text-5xl text-gray-800 text-center font-extrabold">
            Your Privacy <br/>Our responsibilities
          </h2>
          <p className="text-center text-gray-600 text-2xl mt-4">Why your data is in the best hands</p>
          <div className="text-center flex flex-col md:flex-row items-center justify-center mt-12 md:mt-24 gap-20 gap-y-20 md:gap-y-12">
            <div className="flex flex-col items-center md:w-[30%]">
              <div className="h-28">
                <p className="text-lg text-orange-500 font-semibold drop-shadow-lg">State of Art</p>
                <p className="text-5xl text-orange-500 font-semibold drop-shadow-lg">Protection</p>
                <p className="text-lg text-white font-semibold">.</p>
              </div>
              <p className="mt-2 text-center h-20">Cutting-Edge Security — Your files are encrypted using industry-leading standards, with each user receiving a unique encryption key. Leveraging the SHA256 encryption to encrypt your files in-transit and at rest.</p>
            </div>
            <div className="flex flex-col items-center md:w-[33%]">
              <div className="h-32 md:h-28">
                <p className="text-lg text-orange-500 font-semibold drop-shadow-lg">All files are stored</p>
                <p className="text-5xl text-orange-500 font-semibold drop-shadow-lg">within Switzerland</p>
                <p className="text-lg text-white font-semibold">.</p>
              </div>
              <p className="mt-2 text-center h-20 block">Swiss Sanctuary for Data — Benefit from the robust privacy laws and meticulous attention to detail with our exclusive Swiss storage solutions. Your data is not just stored; it’s fortified in the heart of Switzerland.</p>
            </div>
            <div className="flex flex-col items-center md:w-[33%]">
              <div className="h-28">
                <p className="text-lg text-orange-500 font-semibold drop-shadow-lg">Encrypt your files with</p>
                <p className="text-5xl text-orange-500 font-semibold drop-shadow-lg">End-To-End</p>
                <p className="text-lg text-orange-500 font-semibold drop-shadow-lg">encryption</p>
              </div>
              <p className="mt-2 text-center h-20">Unyielding Privacy - Encrypt single files with an end-to-end encryption, to securely encrypt on your device before they are sent to us and remain encrypted throughout their journey. Only you hold the decryption key, ensuring that even we cannot access your data.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className=" mt-16 md:mt-52 bg-gray-100">
        <div className=" container flex flex-col items-center mt-32">
          <div>
            <div>
              <div className="p-2 bg-yellow-500 items-center rounded-3xl w-80 mx-auto">
                {" "}
                <p className="text-center text-gray-50 text-md md:text-lg">
                  ☀️ Summer Sale - UP TO 35% OFF ☀️
                </p>
              </div>
              <h2 className="text-3xl md:text-5xl text-gray-800 text-center mt-10 font-extrabold">
                Start storing your files <br />
                within Switzerland
              </h2>
              <p className="mt-2 md:mt-8 text-center mx-auto text-gray-500 text-lg md:text-xl font-medium w-[80%]">
                The most flexible pricing system which you will ever encouter.{" "}
                <br />
                Don't pay ever again for storage which you don't need.{" "}
              </p>
            </div>
            <div className="flex flex-col md:flex-row mt-10 md:mt-20 md:container md:w-full gap-8">
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
                  glad that there is a provider inside of Switzerland! I can finally store all my pictures!
                </p>
              </div>
              <div className="flex flex-row gap-4 items-center">
                <Avatar className="w-14 h-14 md:w-20 md:h-20 ">
                  <AvatarImage src="/profile.png" />
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-lg md:text-xl text-gray-800 font-semibold">
                    Max Felder
                  </p>
                  <p className="md:text-lg text-gray-600">Photographer</p>
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
                    What is VaultNet?
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    VaultNet is a state-of-the-art platform providing secure and encrypted cloud storage solutions. We offer robust data protection, 
                    ensuring your files and information are stored safely and remain accessible only to you.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-semibold md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                    How do I sign up for VaultNet?
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    Signing up is easy. Click on the "Sign Up" button on our homepage, fill in the required details, 
                    and follow the instructions sent to your email to activate your account.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-semibold md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                    How does VaultNet ensure my data is secure?
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    We employ industry-leading encryption techniques to protect your data. All files are encrypted both in transit 
                    and at rest using AES-256 encryption. Additionally, our platform supports multi-factor authentication to add an extra layer of security to your account.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-semibold md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                    What is end-to-end encryption?
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    End-to-end encryption means your data is encrypted on your device and only decrypted by the intended recipient. 
                    This ensures that no one else, not even VaultNet, can access your data.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
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

                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-lg font-semibold md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                    Is there a limit to the file size or storage capacity?
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    As long as the file size doesn't exceed your current plan,
                    there is no restriction of file size.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger className="text-lg font-semibold md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                    Do you offer any trial periods or money-back guarantees?
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    Every user has up to 50mb of free storage. If you are not
                    satisfied with our service, you can easily cancle your
                    current subscription.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger className="text-lg font-semibold md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                    What happens to my data if I decide to cancel my
                    subscription?
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    If you decide to cancel your subscription, you can still
                    access your files for 10 days. After that, your files will
                    be deleted.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9">
                  <AccordionTrigger className="text-lg font-semibold md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                    How can I access my files?
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    You can access your files easily from everywhere over the
                    VaultNet WebApp.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10">
                  <AccordionTrigger className="text-lg font-semibold md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                    What are the pricing plans available?
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    See all pricing plans{" "}
                    <a href="/subscriptions" className="text-orange-500 underline cursor-pointer">
                      here
                    </a>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-11">
                  <AccordionTrigger className="text-lg font-semibold md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                    How do the additional GB work?
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    With VaultNet's pay-as-you-go pricing model, you have the flexibility to exceed your subscribed storage capacity without any disruption. 
                    When your data usage surpasses your subscription's allocated storage, you will be automatically billed for each additional 10GB increment. 
                    This approach ensures you can scale your storage seamlessly to meet your needs while only paying for the extra space you use. 
                    Keep in mind that we will never charge you if you don't have pay-as-you-go activated.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-12">
                  <AccordionTrigger className="text-lg font-semibold md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                    I need a custom plan for my company
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    If you need a custom plan for your company, please contact
                    our support team at support@vaultnet.ch. We will find the
                    best solution for you.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-13">
                  <AccordionTrigger className="text-lg font-semibold md:text-2xl text-gray-700 [&[data-state=open]]:text-orange-500 text-left">
                    Can I white-label VaultNet for my company?
                  </AccordionTrigger>
                  <AccordionContent className="text-lg md:text-xl text-gray-600">
                    Yes, VaultNet offers white-label solutions that allow you to brand our platform as your own. By white-labeling VaultNet, 
                    you can customize the interface with your company’s logo, colors, and branding elements, creating a seamless experience for 
                    your clients and employees. This service is ideal for businesses looking to provide secure cloud storage under their own brand while 
                    leveraging VaultNet's robust security and functionality. For more details on our white-labeling options and how to get started, 
                    please contact our sales team at <a href="mailto: name@email.com" className="text-orange-500">sales@vaultnet.ch</a>.
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
