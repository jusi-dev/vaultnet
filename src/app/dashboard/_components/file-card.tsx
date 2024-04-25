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
import { getUserById } from "@/actions/aws/users";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"

interface User {
    name: string;
    image: string;
    tokenIdentifier: string;
    mbsUploaded: number;
    orgIds: string[];
    subscriptionType: string;
    userid: string;
}

export function FileCard({ file }: {file: any & {isFavorited: boolean}}) {
    const [fileUrl, setFileUrl] = useState<string>('');
    const [userProfile, setUserProfile] = useState({});
    const getFileUrl = useFileUrlGenerator();

    useEffect(() => {
        const fetchFileUrl = async () => {
            const url = await getFileUrl(file.fileId, 600);
            setFileUrl(url);
        };
    
        fetchFileUrl();
    }, [file.fileId, getFileUrl]);  // This now only re-fetches when fileId or getFileUrl changes
    
    useEffect(() => {
        const fetchUserProfile = async () => {
            const user = await getUserById(file.userId);
            setUserProfile(user);
        };
    
        fetchUserProfile();
    }, [file.userId]);


    const typeIcons = {
        image: <ImageIcon />,
        pdf: <FileTextIcon />,
        csv: <GanttChartIcon />,
        word: <FileTextIcon />,
      } as Record<Doc<"files">["type"], ReactNode>

    return (
        <Card>
            <CardHeader className="relative flex">
                <CardTitle className="flex gap-2 text-gray-700 font-normal">
                    <div className="flex justify-center">{typeIcons[file.type as keyof typeof typeIcons]}</div>
                    {file.name}
                </CardTitle>

                <div className="flex gap-0.5">
                {file.tags?.map((tag: any) => (
                       <HoverCard key={tag}>
                        <HoverCardTrigger>
                            <div className="w-4 h-4 rounded-full" style={{backgroundColor: tag.color}}></div>
                        </HoverCardTrigger>
                        <HoverCardContent className="m-0 p-2 w-auto">
                          {tag.tag}
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                </div>

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
            <CardFooter className="flex flex-col justify-between">
                <div className="flex">
                    <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
                        <Avatar className="w-6 h-6">
                            <AvatarImage src={(userProfile as User)?.image} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        {(userProfile as User)?.name ?? "Unknown User"}
                    </div>
                    <div className="text-xs text-gray-700">
                        Uploaded on {formatRelative(new Date(file._creationTime), new Date())}
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
