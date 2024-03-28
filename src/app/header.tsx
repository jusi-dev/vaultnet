'use client'

import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Header() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
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
                <div className="w-screen flex flex-col justify-center bg-gray-200 py-6 gap-y-8 mt-4">
                    <Button variant={"outline"} className="mx-20">
                        <Link href="/dashboard/files">Your Files</Link>
                    </Button>

                    <div className="flex flex-col mx-auto gap-2">
                        <OrganizationSwitcher />
                        <UserButton 
                            afterSignOutUrl="/"
                            showName={true}
                        />
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

            <div className="hidden md:flex">
                <Button variant={"outline"} className="ml-10">
                    <Link href="/dashboard/files">Your Files</Link>
                </Button>

                <div className="flex gap-2 ml-auto">
                    <OrganizationSwitcher />
                    <UserButton 
                        afterSignOutUrl="/"
                        showName={true}
                    />
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
        </div>
    </div>
}