import { getCurrentSubscription, getMe, updateSubscription } from "@/actions/aws/users"
import { changeSubscription } from "@/actions/stripe"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { InfoCircleOutlined } from "@ant-design/icons"
import { get } from "http"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function SubscriptionOverview() {
    const [subscription, setSubscription] = useState("Free")
    const [user, setUser] = useState({} as any)
    const [isCancelling, setIsCancelling] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const subscriptionType = {
        "premium": "Premium",
        "free": "Free",
        "alpha": "Pilot-User",
    } as any

    const payAsYouGo = {
        false: "disabled",
        null: "disabled",
        undefined: "disabled",
        true: "enabled"
    } as any

    const getSubscription = async() => {
        const subscription = await getMe()
        setUser(subscription)
        return subscriptionType[subscription.subscriptionType]
    }

    const cancelSubscriptionAPI = async() => {
        const response = await changeSubscription(user.customerId, "free")
        getSubscription().then(subscription => {
            setSubscription(subscription)
        })

        return response
    }

    useEffect(() => {
        // Fetch user subscription
        getSubscription().then(subscription => {
            setSubscription(subscription)
            setIsLoading(false)
        })
    }, [])

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold">Subscription Overview</h1>
                        <p className="text-gray-500">Manage your subscription and billing information</p>
                    </div>
                </div>
                {!isLoading ?
                <>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-xl font-bold">Current Plan</h2>
                                <p className="text-gray-500">You are currently on the <span className="font-bold">{subscription}</span> plan.</p>
                                {subscription !== "Free" && subscription !== "Pilot-User" &&
                                    <div>
                                        <Button 
                                            disabled={isCancelling}
                                            variant={"destructive"} onClick={async () => {
                                                setIsCancelling(true)
                                                const response = await cancelSubscriptionAPI()
                                                if (response.error) {
                                                    toast({
                                                        variant: "destructive",
                                                        title: "Subscription Cancel Failed",
                                                        description: `Ensure that your usage doesn't exceed the new plan limits of ${response.subscriptionLimit} MBs OR activate pay-as-you-go.`,
                                                    })
                                                } else {
                                                    toast({
                                                        variant: "success",
                                                        title: "Subscription Cancelled",
                                                        description: "Your subscription has been successfully cancelled.",
                                                    })
                                                }
                                                setIsCancelling(false)
                                            }}
                                        >
                                            {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
                                            Cancel Subscription
                                        </Button>
                                        <p className="text-gray-500 italic text-xs mt-2">* If you cancel your subscriptions, your biggest files will be deleted after 10 days to match the new storage size. Alternatively you can activate pay-as-you-go. <span className="text-blue-400 cursor-pointer underline"><InfoCircleOutlined /> Learn more</span></p>
                                    </div>
                                }
                                <p className="text-gray-500">You currently have <span className="font-bold">Pay-As-You-Go</span> { payAsYouGo[user.payAsYouGo] }.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-xl font-bold">Billing Information</h2>
                                <p className="text-gray-500">Update your billing information</p>
                            </div>
                        </div>
                    </div>
                </>
                :
                <div className="flex flex-col gap-8 w-full h-full items-center mt-24">
                    <Loader2 className="h-32 w-32 animate-spin" />
                    <p className="text-3xl text-center text-gray-700">
                        Loading your subscription...
                    </p>
                </div>
                }

            </div>
        </>
    )
}