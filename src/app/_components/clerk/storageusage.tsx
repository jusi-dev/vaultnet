import { getMe, getSubscriptionStorage } from "@/actions/aws/users"
import { set } from "date-fns"
import { useEffect, useState } from "react"

export default function StorageUsage() {
    const [me, setMe] = useState({} as any)
    const [subscriptionSize, setSubscriptionSize] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [storageSize, setStorageSize] = useState("")
    const getUser = async () => {
        const me = await getMe()
        const subSize = await getSubscriptionStorage(me.subscriptionType)
        console.log("This is the sub size: ", subSize)
        setSubscriptionSize(subSize.size)
        setMe(me)
        console.log(me)
        convertStorageSize(subSize.size)
        setIsLoading(false)
    }

    const convertStorageSize = (size: number) => {
        const mb = (size / (1024 * 1024));
        const gb = mb / 1024;

        if (mb < 1024) {
            setStorageSize(`${mb.toFixed(2)} MB`)
        } else {
            setStorageSize(`${gb.toFixed(2)} GB`)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold">Storage Usage</h1>
                        <p className="text-gray-500">Manage your storage usage and billing information</p>
                    </div>
                </div>

                {!isLoading ?

                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-xl font-bold">Current Usage</h2>
                                <p className="text-gray-500">You are currently using <span className="font-bold">{(me.mbsUploaded / (1024 * 1024)).toFixed(2)} MB</span> of storage from <span className="font-bold">{storageSize}.</span></p>
                            </div>
                        </div>
                    </div>
                :
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-xl font-bold">Current Usage</h2>
                                <p className="text-gray-500">Calculating...</p>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}