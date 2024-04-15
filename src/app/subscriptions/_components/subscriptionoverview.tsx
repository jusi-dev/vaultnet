export default function SubscriptionOverview() {
    return <div className="flex flex-col gap-4">
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
                    <p className="text-gray-500">You are currently on the <span className="font-bold">Basic</span> plan</p>
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
}