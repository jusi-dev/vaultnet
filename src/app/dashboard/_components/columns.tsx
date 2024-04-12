import { ColumnDef } from "@tanstack/react-table"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { formatRelative } from "date-fns"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileCardActions, useFileUrlGenerator } from "./file-actions"
import { useEffect, useState } from "react"
import { getUserById } from "@/actions/aws/users"

interface User {
    name: string;
    image: string;
    tokenIdentifier: string;
    mbsUploaded: number;
    orgIds: string[];
    subscriptionType: string;
    userid: string;
}

function UserCell({userId} : {userId: string}) {
    const [userProfile, setUserProfile] = useState({});
    
    useEffect(() => {
        const fetchUserProfile = async () => {
            const user = await getUserById(userId);
            setUserProfile(user);
        };
    
        fetchUserProfile();
    }, []);

    return  (
        <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
            <Avatar className="w-6 h-6">
                <AvatarImage src={(userProfile as User)?.image} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {(userProfile as User)?.name ?? "Unknown User"}
        </div>
    )
}

function ActionsCell({row} : {row: {original: Doc<"files"> & { isFavorited: boolean }}}) {
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const getFileUrl = useFileUrlGenerator();

    useEffect(() => {
        (async () => {
            const url = await getFileUrl(row.original.fileId, 600);
            setDownloadUrl(url);
        })();
    
    })

    return (
        <div>
            <FileCardActions isFavorited={row.original.isFavorited} file={row.original} downloadUrl={downloadUrl}/>
        </div>
    )
}

export const columns: ColumnDef<Doc<"files"> & { isFavorited: boolean }>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
        header: "User",
        cell: ({ row }) => {
            return <UserCell userId={row.original.userId}/>
        },
    },
    {
        header: "Uploaded On",
        cell: ({ row }) => {
            return <div>{formatRelative(new Date(row.original._creationTime), new Date())}</div>
        },
    },
    {
        header: "Actions",
        cell: ({ row }) => {
            return <ActionsCell row={row} />
        },
    },
  ]