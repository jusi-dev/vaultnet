import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

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
                    <p className="text-xl text-gray-500 md:ml-3 md:mt-2">forever</p>
                </div>
            </div>
            <div className="flex flex-col w-full mt-10">
                <ul className="md:font-semibold">
                <li className="flex"><Check className="flex-shrink-0"/> 250GB of Storage</li>
                <li className="flex"><Check className="flex-shrink-0"/> Unlimited members in a single organization</li>
                <li className="flex"><Check className="flex-shrink-0"/> + CHF 1 per additional 10 GB </li>
                </ul>
            </div>
            <div className="mt-10">
                <Button variant="orange" className="text-2xl w-full" size={"landing"}>Choose Now</Button>
                <p className="text-center font-extralight mt-1">Recurring monthly costs</p>
            </div>
        </div>
    )
}