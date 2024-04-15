import { getCurrentSubscription, getMe, updateSubscription } from "@/actions/aws/users"
import { cancelSubscription } from "@/actions/stripe"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { InfoCircleOutlined } from "@ant-design/icons"
import { get } from "http"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function SubscriptionOverview() {
    const [subscription, setSubscription] = useState("free")
    const [user, setUser] = useState({} as any)
    const [isCancelling, setIsCancelling] = useState(false)

    const subscriptionType = {
        "premium": "Premium",
        "free": "Free"
    } as any

    const getSubscription = async() => {
        const subscription = await getMe()
        setUser(subscription)
        return subscriptionType[subscription.subscriptionType]
    }

    const cancelSubscriptionAPI = async() => {
        console.log("Click Subscription Cancel")
        await cancelSubscription(user.customerId)
        console.log("Subscription Cancelled")
        getSubscription().then(subscription => {
            setSubscription(subscription)
        })
    }

    useEffect(() => {
        // Fetch user subscription
        getSubscription().then(subscription => {
            setSubscription(subscription)
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

                <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-xl font-bold">Current Plan</h2>
                            <p className="text-gray-500">You are currently on the <span className="font-bold">{subscription}</span> plan</p>
                            {subscription !== "free" &&
                                <div>
                                    <Button 
                                        disabled={isCancelling}
                                        variant={"destructive"} onClick={async () => {
                                            setIsCancelling(true)
                                            await cancelSubscriptionAPI()
                                            setIsCancelling(false)
                                            toast({
                                                variant: "destructive",
                                                title: "Subscription cancelled",
                                                description: "Your subscription has been successfully cancelled.",
                                            })
                                        }}
                                    >
                                        {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
                                        Cancel Subscription
                                    </Button>
                                    <p className="text-gray-500 italic text-xs mt-2">* If you cancel your subscriptions, random files will be deleted after 10 days when the storage size exceeds. <span className="text-blue-400 cursor-pointer underline"><InfoCircleOutlined /> Learn more</span></p>
                                </div>
                            }
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

            </div>
        </>
    )
}