'use client'

import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Database, Menu, SubscriptIcon, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SubscriptionOverview from "./subscriptions/_components/subscriptionoverview";
import StorageUsage from "./_components/clerk/storageusage";

export function Header() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
    return <div className="border-b py-4 bg-gray-50/75 w-screen backdrop-blur-lg z-50">
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

            {isOpen &&
                <div className="w-screen flex flex-col justify-center bg-gray-100 py-6 gap-y-8 mt-4">
                    <div className="flex flex-col mx-auto gap-6 items-center justify-center">
                        <Link href={"/subscriptions"} className="flex items-center text-gray-600 gap-2 font-semibold underline underline-offset-2 text-lg cursor-pointer hover:text-orange-500">
                            Subscriptions
                        </Link>
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
                        <SignedOut>
                            <SignInButton
                                mode="modal"
                                redirectUrl="/dashboard/files"
                            >
                                <Button>Sign In</Button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
            }

            <div className="hidden md:flex gap-x-4 justify-center items-center">
                <Link href={"/subscriptions"} className="flex items-center text-gray-600 gap-2 font-semibold underline underline-offset-2 text-lg cursor-pointer hover:text-orange-500">
                    Subscriptions
                </Link>
                <SignedIn>
                    <Button variant={"outline"} className="ml-10">
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
}