import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export function Header() {
    return <div className="border-b py-4 bg-gray-50/75 fixed w-screen backdrop-blur-lg z-50">
        <div className="items-center container mx-auto flex">
            <Link href={"/"} className="flex items-center gap-2 font-bold text-xl cursor-pointer">
                <Image src="/logo-faultnet.png" width={50} height={30} alt="VaultNet" />
                VaultNet
            </Link>

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
}