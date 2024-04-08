import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import Image from "next/image";

import { formatRelative } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  
import { FileTextIcon, GanttChartIcon, ImageIcon} from "lucide-react";
import { ReactNode, useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { FileCardActions, useFileUrlGenerator } from "./file-actions";

export function FileCard({ file }: {file: Doc<"files"> & {isFavorited: boolean}}) {
    const [fileUrl, setFileUrl] = useState<string>('');
    const getFileUrl = useFileUrlGenerator();

    useEffect(() => {
        (async () => {
            const url = await getFileUrl(file.fileId, 600);
            setFileUrl(url);
        })();
    }, [file.fileId, getFileUrl]);

    const userProfile = useQuery(api.users.getUserProfile, {
        userId: file.userId
    });


    const typeIcons = {
        image: <ImageIcon />,
        pdf: <FileTextIcon />,
        csv: <GanttChartIcon />,
        word: <FileTextIcon />,
      } as Record<Doc<"files">["type"], ReactNode>

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2 text-gray-700 font-normal">
                    <div className="flex justify-center">{typeIcons[file.type]}</div>
                    {file.name}
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions isFavorited={file.isFavorited} file={file} downloadUrl={fileUrl}/>
                </div>
            </CardHeader>
            <CardContent className="h-[200px] flex justify-center items-center">
            {file.type === "image" && (
                <Image
                    alt={file.name}
                    width="200"
                    height="100"
                    // @ts-ignore
                    src={fileUrl}
                />
            )}

            {file.type === "csv" && <GanttChartIcon className="w-20 h-20"/>}
            {file.type === "pdf" && <FileTextIcon className="w-20 h-20"/>}
            </CardContent>
            <CardFooter className="flex justify-between">
                <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
                    <Avatar className="w-6 h-6">
                        <AvatarImage src={userProfile?.image} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {userProfile?.name ?? "Unknown User"}
                </div>
                <div className="text-xs text-gray-700">
                    Uploaded on {formatRelative(new Date(file._creationTime), new Date())}
                </div>
            </CardFooter>
        </Card>
    );
}
