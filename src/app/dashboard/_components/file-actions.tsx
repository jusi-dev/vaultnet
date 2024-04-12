import { Doc, Id } from "../../../../convex/_generated/dataModel";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"


import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
  
import { DownloadIcon, MoreVertical, Share2Icon, ShareIcon, StarHalf, StarIcon, Trash2Icon, UndoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Protect } from "@clerk/nextjs";
import { ShareButton } from "./share-button";
import { deleteFile, restoreFile, toggleFavorite } from "@/actions/aws/files";
import { getMe } from "@/actions/aws/users";

export function useFileUrlGenerator () {
    const getFileUrl = async (fileId: Id<"_storage"> | string, shareTime: number) => {
        if (!fileId) {
            return '';
        }

        if (!shareTime) {
            shareTime = 600
        }

        try {
            const formData = new FormData();
            await formData.append('fileId', fileId);
            await formData.append('orgId', "1245") // TODO: Add real orgId
            await formData.append('shareTime', shareTime.toString())
            // const res = await generateDownloadUrl({ fileId })
            const res = await fetch('/api/downloadfile', {
                method: 'POST',
                body: formData
            }).then(res => res.json())
            return res.downloadUrl as string || '';
        } catch (error) {
            return ''; // Return an empty string in case of error
        }
    }
    return getFileUrl;
}
  
  
export function FileCardActions({ isFavorited, file, downloadUrl }: { isFavorited: boolean ,file: Doc<"files">, downloadUrl: string }) {
    const { toast } = useToast();

    // const toggleFavorite = useMutation(api.files.toggleFavorite);
    // const deleteFile = useMutation(api.files.deleteFile);
    // const restoreFile = useMutation(api.files.restoreFile);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [me, setMe] = useState<any>(null);

    useEffect(() => {
        (async () => {
            const user = await getMe();
            console.log("File actions user: ", user);
            setMe(user);
        })();
    }, [])

    return (
        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will mark the file as deleted. The file gets deleted in 30 days permanentely.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={ async () => {
                        await deleteFile(file.fileId)
                        window.dispatchEvent(new CustomEvent('fileUploaded'));
                        toast({
                            variant: "destructive",
                            title: "File Deleted",
                            description: "Your file will be deleted in 30 days.",
                        })
                    }}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <ShareButton isShareOpen={isShareOpen} setIsShareOpen={setIsShareOpen} fileId={file.fileId}/>

            <DropdownMenu>
                <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={() => {
                            toggleFavorite(file.fileId)
                            window.dispatchEvent(new CustomEvent('fileUploaded'));
                        }} 
                        className="flex gap-1 text-yellow-500 items-center cursor-pointer"
                    >
                        {isFavorited ? (
                            <div className="flex gap-1 items-center">
                                <StarIcon className="w-4 h-4"/> Unfavorite
                            </div>
                        ) : (
                            <div className="flex gap-1 items-center">
                                <StarHalf className="w-4 h-4"/> Favorite
                            </div>
                        )}
                        
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            window.open( downloadUrl, "_blank")
                        }}
                    >
                        <div className="flex gap-1 items-center">
                            <DownloadIcon className="w-4 h-4"/> Download
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setIsShareOpen(true)
                        }}
                    >
                        <div className="flex gap-1 items-center">
                            <ShareIcon className="w-4 h-4"/> Share
                        </div>
                    </DropdownMenuItem>
                    <Protect
                        condition={(check) => {
                            console.log("This is file.userId", file.userId)
                            console.log("This is me.userId", me?.userId)
                            return check({
                                role: "org:admin"
                            }) || file.userId === me?.userid
                        }}
                        fallback={
                            <></>
                        }
                    >
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                if (file.shouldDelete) {
                                    restoreFile(file.fileId);
                                    window.dispatchEvent(new CustomEvent('fileUploaded'));
                                    toast({
                                        variant: "success",
                                        title: "File Restored",
                                        description: "Your file has been restored.",
                                    })
                                } else {
                                    setIsConfirmOpen(true)
                                }
                            }} 
                            className="flex gap-1 items-center cursor-pointer"
                        >
                            {file.shouldDelete ?
                                <div className="flex gap-1 text-green-600 "> 
                                    <UndoIcon className="w-4 h-4"/> Restore
                                </div>
                            : 
                                <div className="flex gap-1 text-red-600 ">
                                    <Trash2Icon className="w-4 h-4"/> Delete
                                </div>
                            }
                        </DropdownMenuItem>
                    </Protect>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );

}