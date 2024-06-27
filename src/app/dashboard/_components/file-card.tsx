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
  
import { FileTextIcon, GanttChartIcon, ImageIcon, Loader2, Lock, LockOpen} from "lucide-react";
import { ReactNode, useState, useEffect, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { FileCardActions, decryptAndDownloadURL, getFileUrl } from "./file-actions";
import { getUserById } from "@/actions/aws/users";

import DocViewer, { DocViewerRenderers, IHeaderOverride } from "@cyntler/react-doc-viewer";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"

import * as reactpdf from 'react-pdf';

interface User {
    name: string;
    image: string;
    tokenIdentifier: string;
    mbsUploaded: number;
    orgIds: string[];
    subscriptionType: string;
    userid: string;
}

export function FileCard({ file, user }: {file: any & {isFavorited: boolean}, user: any}) {
    const [fileUrl, setFileUrl] = useState<string>('');
    const [userProfile, setUserProfile] = useState({});
    const [firstLoad, setFirstLoad] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFileUrl = async () => {
        
        const isFileEncrypted = file.isEncrypted;

        const url = await getFileUrl(file.fileId, 36000, user);
        const downloadUrl = await decryptAndDownloadURL(url, user, isFileEncrypted); // TODO: Only automatically do this if the file is below XXX MB. because this is a costly operation
        
        setFileUrl(downloadUrl as string)
        setIsLoading(false);
    }

    useEffect(() => {
        fetchFileUrl();
    }, []);

    const fetchUserProfile = async () => {
        const user = await getUserById(file.userId)
        setUserProfile(user);
    };

    useEffect(() => {
        if (firstLoad) {
            fetchUserProfile();
            setFirstLoad(false);
        }
    }, []);


    const typeIcons = {
        image: <ImageIcon />,
        pdf: <FileTextIcon />,
        csv: <GanttChartIcon />,
        word: <FileTextIcon />,
      } as Record<Doc<"files">["type"], ReactNode>

    return (
        <Card className="md:w-full">
            <CardHeader className="relative flex">
                <CardTitle className="flex gap-2 text-gray-700 font-normal">
                    <div className="flex justify-center">{typeIcons[file.type as keyof typeof typeIcons]}</div>
                    <HoverCard key={file.name}>
                        <HoverCardTrigger>
                            <p className="line-clamp-1">{file.name}</p>    
                        </HoverCardTrigger>
                        <HoverCardContent>
                            <p>{file.name}</p>
                        </HoverCardContent>
                    </HoverCard>
                     
                </CardTitle>

                <div className="flex gap-0.5">
                {file.tags?.map((tag: any) => (
                       <HoverCard key={tag.tag}>
                            <HoverCardTrigger>
                                <div className="w-4 h-4 rounded-full text-xs text-center text-white" style={{backgroundColor: tag.color}}>{tag.tag.charAt(0).toUpperCase()}</div>
                            </HoverCardTrigger>
                            <HoverCardContent className="m-0 p-2 w-auto">
                            {tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1)}
                            </HoverCardContent>
                      </HoverCard>
                    ))}
                </div>

                <div className="absolute top-2 right-2">
                    <div className="flex gap-1 justify-center items-center">
                        <HoverCard key={file.name}>
                            <HoverCardTrigger>
                                {file.isEncrypted ? <Lock className="w-4 h-4 text-green-500"/> : <LockOpen className="w-4 h-4 text-red-500"/>} 
                            </HoverCardTrigger>
                            <HoverCardContent className="w-auto">
                                <p className="text-sm font-light">{file.isEncrypted ? "Encrypted" : "Decrypted"}</p>
                            </HoverCardContent>
                        </HoverCard>
                        <FileCardActions isFavorited={file.isFavorited} file={file} downloadUrl={fileUrl} user={user}/>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="h-[200px] flex justify-center items-center">
            {isLoading 
            ?
            <div className=" flex flex-col gap-8 w-full h-full items-center">
                <Loader2 className="h-16 w-16 animate-spin text-orange-500" />
                <p className="text-xl text-center text-gray-700">
                  Loading preview...
                </p>
            </div>
            :
            <>

            {file.type === "image" && (
                <div className="flex h-full w-full justify-center overflow-hidden">
                    <img src={fileUrl} alt={file.name} />
                </div>
            )}

            {file.type === "csv" && <GanttChartIcon className="w-20 h-20"/>}
            {file.type === "pdf" && 
                <div className="flex h-full w-full justify-center overflow-hidden">
                    <reactpdf.Document file={fileUrl}>
                        <reactpdf.Page pageNumber={1} className={"w-1/2 h-full"} scale={0.45}/>
                    </reactpdf.Document>
                </div>
            }
            {file.type === "word" && 
                // <div className="flex h-full w-full justify-center overflow-hidden">
                //     <iframe src={`http://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`} width={"100%"} height={"100%"}></iframe>
                // </div>
                <div>
                    <p className="text-center text-gray-500 text-xl">This file type is currently not supported for preview.</p>
                </div>
            }
            </>
            }
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
