"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import CheckoutForm from "./checkoutform";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function SubscriptionCard({ subscription, price, shortDesc, topChoice, subPerks, orgPrice } : { subscription: string, price: number, shortDesc: string, topChoice?: boolean, subPerks?: any, orgPrice: string}) {

    const { storageSize, members, additionalStoragePrice } = subPerks;

    const user = useUser();

    return(
        <div className="flex flex-col md:w-[30vw] bg-white p-12 rounded-lg border-2 border-orange-500 mt-10 drop-shadow-lg">
            {topChoice &&
                <div className="flex w-full justify-center">
                    <div className="p-1 bg-orange-500 items-center rounded-3xl w-60 md:w-80 -mt-16 absolute">
                    <p className="text-center text-gray-50">TOP CHOICE</p>
                    </div>
                </div>
            }
            <div className="flex flex-col gap-y-4">
                <div>
                    <h2 className="text-4xl font-bold text-center">{subscription}</h2>
                    <p className="text-center text-gray-500">{shortDesc}</p>
                </div>
                <div className="flex flex-wrap items-center gap-y-1">
                    <p className="font-normal line-through text-gray-500 text-xl">CHF {orgPrice}</p>
                    <p className="text-3xl font-bold ml-3">CHF {price / 100}</p>
                    <p className="text-xl text-gray-500 md:ml-3 md:mt-2">per month</p>
                </div>
            </div>
            <div className="flex flex-col w-full mt-10 h-20">
                <ul className="md:font-semibold">
                <li className="flex"><Check className="flex-shrink-0"/> {storageSize}GB of Storage</li>
                <li className="flex"><Check className="flex-shrink-0"/> {members} members in a single organization</li>
                <li className="flex"><Check className="flex-shrink-0"/> + CHF {additionalStoragePrice.toFixed(2)} per additional 10 GB </li>
                </ul>
            </div>
            <div className="mt-10">
                { user.isSignedIn 
                    ?
                        <CheckoutForm uiMode="hosted" subscriptionType={subscription}/>
                    :
                        <Link href={"https://accounts.vaultnet.ch/sign-up?redirect_url=https://vaultnet.ch/subscriptions/"}>
                            <Button variant="orange" className="text-2xl w-full hover:cursor-pointer" size={"landing"}>Start Now</Button>
                        </Link>
                }
                {/* <Button variant="orange" className="text-2xl w-full hover:cursor-not-allowed" size={"landing"}>Currently not available</Button> */}
                <p className="text-center font-extralight mt-1">Recurring monthly costs</p>
            </div>
        </div>
    )
}