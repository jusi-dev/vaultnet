import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

export default function SubscriptionCardFree() {

    return(
        <div className="flex flex-col md:w-[30vw] bg-white p-12 rounded-lg border-2 border-orange-500 mt-10 drop-shadow-lg">
            <div className="flex flex-col gap-y-4">
                <div>
                    <h2 className="text-4xl font-bold text-center">Vault 0</h2>
                    <p className="text-center text-gray-500">For users who just want to peak in</p>
                </div>
                <div className="flex flex-wrap items-center gap-y-1">
                    <p className="text-3xl font-bold ml-3">Free</p>
                    <p className="text-xl text-gray-500 ml-3 mt-2">forever</p>
                </div>
            </div>
            <div className="flex flex-col w-full mt-10 h-20">
                <ul className="md:font-semibold">
                <li className="flex"><Check className="flex-shrink-0"/> 50MB of Storage</li>
                <li className="flex"><Check className="flex-shrink-0"/> Up to 5 members in a single organization</li>
                <li className="flex"><Check className="flex-shrink-0"/> + CHF 1.50 per additional 10 GB </li>
                </ul>
            </div>
            <div className="mt-10">
                <Link href="https://accounts.vaultnet.ch/sign-up">
                    <Button variant="orange" className="text-2xl w-full hover:cursor-pointer" size={"landing"}>Start Now</Button>
                </Link>
                <p className="text-center font-extralight mt-1">No recurring monthly costs</p>
            </div>
        </div>
    )
}