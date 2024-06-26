import { Button } from "@/components/ui/button"
import { SignedIn } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"

export default function subscriptionSuccessful() {
    return (
        <div className="flex flex-col container my-20 items-center gap-y-20">
            <h1 className="text-6xl font-bold text-orange-400 text-center">Something went wrong</h1>
            <div
                className="w-14 md:w-[45%] h-[50vh] bg-[url('/order-failed.svg')] bg-cover bg-center"
              ></div>
            <div className="flex flex-col items-center">
                <p className="text-xl font-semibold text-center text-gray-700">Something went wrong with your transaction.</p>
                <p className="text-xl font-semibold text-center text-gray-700">Return to the subscription page.</p>
                <SignedIn>
                    <Button variant={"orange"} size={"landing"} className="mt-8">
                        <Link href="/subscriptions">Back to Subscriptions</Link>
                    </Button>
                </SignedIn>
            </div>
        </div>
    )
}