'use client';

import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Database, Menu, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SubscriptionOverview from "./subscriptions/_components/subscriptionoverview";
import StorageUsage from "./_components/clerk/storageusage";

export function Header() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <div className="border-b py-4 bg-gray-50/75 w-screen backdrop-blur-lg z-50 fixed top-0">
                <div className="container mx-auto flex flex-col md:flex-row items-center">
                    <div className="flex w-full justify-between items-center">
                        <Link href={"/"} className="flex items-center gap-2 font-bold text-2xl cursor-pointer">
                            <Image src="/logo-faultnet.png" width={50} height={30} alt="VaultNet" />
                            VaultNet
                        </Link>

                        <div className="flex md:hidden ml-auto">
                            <Menu className="cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
                        </div>
                    </div>

                    <div className="hidden md:flex gap-x-6 justify-center items-center">
                        <Link href={"/about"} className="text-center flex flex-col text-nowrap items-center text-gray-600 gap-2 font-semibold text-lg cursor-pointer hover:text-orange-500">
                            About Us
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
                            <OrganizationSwitcher />
                            <UserButton 
                                afterSignOutUrl="/"
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

            {/* Mobile Nav */}
            <div className={`fixed top-0 left-0 w-full h-full lg:hidden bg-gray-100 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`} style={{ paddingTop: '64px' }}>
                <div className="flex flex-col mx-auto gap-6 items-center justify-center h-full">
                    <Link href={"/about"} className="flex flex-col items-center text-gray-600 gap-2 font-semibold text-2xl cursor-pointer hover:text-orange-500" onClick={() => setIsOpen(false)}>
                        About Us
                    </Link>
                    <Link href={"/contact"} className="flex items-center text-gray-600 gap-2 font-semibold text-2xl cursor-pointer hover:text-orange-500" onClick={() => setIsOpen(false)}>
                        Contact
                    </Link>
                    <Link href={"/subscriptions"} className="flex items-center text-gray-600 gap-2 font-semibold text-2xl cursor-pointer hover:text-orange-500" onClick={() => setIsOpen(false)}>
                        Pricing
                    </Link>
                    <SignedIn>
                        <Button variant={"orange"} size={"lg"} className="text-xl p-6 mt-4 mb-4" onClick={() => setIsOpen(false)}>
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
                            <Button variant={"orange"} size={"lg"} className="text-2xl p-6 mt-8">Sign In</Button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>
        </>
    );
}
