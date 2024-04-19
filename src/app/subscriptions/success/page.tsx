import { Button } from "@/components/ui/button"
import { SignedIn } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"

export default function subscriptionSuccessful() {
    return (
        <div className="flex flex-col container my-20 items-center gap-y-20">
            <h1 className="text-6xl font-bold text-orange-400 text-center">Subscription Successful</h1>
            <div
                className="w-14 md:w-[45%] h-[50vh] bg-[url('/order-confirmed.svg')] bg-cover bg-center"
              ></div>
            <div className="flex flex-col items-center">
                <p className="text-xl font-semibold text-center text-gray-700">Your subscription has been successfully processed.</p>
                <p className="text-xl font-semibold text-center text-gray-700">Start exploring your files:</p>
                <SignedIn>
                    <Button variant={"orange"} size={"landing"} className="mt-8">
                        <Link href="/dashboard/files">Your Files</Link>
                    </Button>
                </SignedIn>
            </div>
        </div>
    )
}