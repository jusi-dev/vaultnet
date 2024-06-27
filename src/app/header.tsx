'use client'

import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignInButton, SignedIn, SignedOut, UserButton, currentUser, useUser } from "@clerk/nextjs";
import { Database, Menu, SubscriptIcon, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SubscriptionOverview from "./subscriptions/_components/subscriptionoverview";
import StorageUsage from "./_components/clerk/storageusage";
import { setEncryptionKeyToUser } from "@/actions/aws/users";

export function Header() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

    return (
        <>
            {/* <div className="w-full bg-orange-500 py-4 text-white flex text-center">
                <p><span className="font-bold">Alpha Rollout:</span> We finally enrolled our first alpha users.</p>
            </div> */}
            <div className="border-b py-4 bg-gray-50/75 w-screen backdrop-blur-lg z-50">
                <div className="items-center container mx-auto flex flex-col md:flex-row">
                    <div className="flex w-full justify-between items-center">
                        <Link href={"/"} className="flex items-center gap-2 font-bold text-2xl cursor-pointer">
                            <Image src="/logo-faultnet.png" width={50} height={30} alt="VaultNet" />
                            VaultNet
                        </Link>

                        <div className="flex md:hidden ml-auto">
                            <div>
                                <Menu onClick={() => setIsOpen(!isOpen)}/>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Nav */}
                    {isOpen &&

                        <div className={`w-screen flex flex-col lg:hidden justify-center bg-gray-100 py-6 gap-y-8 mt-4 z-50 origin-top transition-all ease-in-out`}>
                            <div className="flex flex-col mx-auto gap-6 items-center justify-center">
                                <Link href={"/about"} className="flex items-center text-gray-600 gap-2 font-semibold text-lg cursor-pointer hover:text-orange-500">
                                    About
                                </Link>
                                <Link href={"/contact"} className="flex items-center text-gray-600 gap-2 font-semibold text-lg cursor-pointer hover:text-orange-500">
                                    Contact
                                </Link>
                                <Link href={"/subscriptions"} className="flex items-center text-gray-600 gap-2 font-semibold text-lg cursor-pointer hover:text-orange-500">
                                    Pricing
                                </Link>
                                <SignedIn>
                                    <Button variant={"orange"} className="mx-20">
                                        <Link href="/dashboard/files">Your Files</Link>
                                    </Button>
                                    <OrganizationSwitcher />
                                    <UserButton 
                                        afterSignOutUrl="/"
                                        showName={true}
                                        >
                                        <UserButton.UserProfilePage
                                            label="Subscription"
                                            labelIcon={<Wallet className="w-4 h-4 justify-center items-center flex"/>}
                                            url="/dashboard/subscription"
                                            >
                                            <SubscriptionOverview />
                                        </UserButton.UserProfilePage>
                                        <UserButton.UserProfilePage
                                            label="Usage"
                                            labelIcon={<Database className="w-4 h-4 justify-center items-center flex"/>}
                                            url="/dashboard/usage"
                                            >
                                            <StorageUsage />
                                        </UserButton.UserProfilePage>
                                    </UserButton>
                                </SignedIn>
                                <SignedOut>
                                    <SignInButton
                                        mode="modal"
                                        redirectUrl="/dashboard/files"
                                    >
                                        <Button variant={"orange"}>Sign In</Button>
                                    </SignInButton>
                                </SignedOut>
                            </div>
                        </div>
                    }

                    <div className="hidden md:flex gap-x-6 justify-center items-center">
                        <Link href={"/about"} className="text-center flex items-center text-gray-600 gap-2 font-semibold text-lg cursor-pointer hover:text-orange-500">
                            About
                        </Link>
                        <Link href={"/contact"} className="text-center flex items-center text-gray-600 gap-2 font-semibold text-lg cursor-pointer hover:text-orange-500">
                            Contact
                        </Link>
                        <Link href={"/subscriptions"} className="text-center flex items-center whitespace-nowrap text-gray-600 gap-2 font-semibold text-lg cursor-pointer hover:text-orange-500">
                            Pricing
                        </Link>
                        <SignedIn>
                            <Button variant={"outline"} className="ml-4">
                                <Link href="/dashboard/files">Your Files</Link>
                            </Button>
                        </SignedIn>

                        <div className="flex gap-4 ml-auto">
                            {/* <CancelSubscriptionComponent isConfirmOpen={false} setIsConfirmOpen={setIsConfirmOpen} /> */}
                            <OrganizationSwitcher />
                                <UserButton 
                                    afterSignOutUrl="/"
                                    // showName={true}
                                >
                                    <UserButton.UserProfilePage
                                        label="Subscription"
                                        labelIcon={<Wallet className="w-4 h-4 justify-center items-center flex"/>}
                                        url="/dashboard/subscription"
                                    >
                                        <SubscriptionOverview />
                                    </UserButton.UserProfilePage>
                                    <UserButton.UserProfilePage
                                        label="Usage"
                                        labelIcon={<Database className="w-4 h-4 justify-center items-center flex"/>}
                                        url="/dashboard/usage"
                                    >
                                        <StorageUsage />
                                    </UserButton.UserProfilePage>
                                </UserButton>
                            <SignedOut>
                                <SignInButton
                                    mode="modal"
                                    redirectUrl="/dashboard/files"
                                >
                                    <Button variant={"orange"}>Sign In</Button>
                                </SignInButton>
                            </SignedOut>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}