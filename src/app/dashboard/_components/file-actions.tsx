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
  
import { DownloadIcon, MoreVertical, StarHalf, StarIcon, Trash2Icon, UndoIcon } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Protect } from "@clerk/nextjs";

export function useFileUrlGenerator () {
    const generateDownloadUrl = useMutation(api.files.generateDownloadUrl);

    const getFileUrl = async (fileId: Id<"_storage">) => {
        if (!fileId) {
            return '';
        }
        try {
            const res = await generateDownloadUrl({ fileId })
            console.log(res);
            return res || '';
        } catch (error) {
            console.error("Error generating download URL:", error);
            return ''; // Return an empty string in case of error
        }
    }
    return getFileUrl;
}
  
  
export function FileCardActions({ isFavorited, file, downloadUrl }: { isFavorited: boolean ,file: Doc<"files">, downloadUrl: string }) {
    const { toast } = useToast();

    const toggleFavorite = useMutation(api.files.toggleFavorite);
    const deleteFile = useMutation(api.files.deleteFile);
    const restoreFile = useMutation(api.files.restoreFile);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const me = useQuery(api.users.getMe)
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
                        await deleteFile({
                            fileId: file._id
                        });
                        toast({
                            variant: "destructive",
                            title: "File Deleted",
                            description: "Your file will be deleted in 30 days.",
                        })
                    }}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
                <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={() => {
                            toggleFavorite({ fileId: file._id });
                        
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
                    <Protect
                        condition={(check) => {
                            return check({
                                role: "org:admin"
                            }) || file.userId === me?._id
                        }}
                        fallback={
                            <></>
                        }
                    >
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                if (file.shouldDelete) {
                                    restoreFile({ fileId: file._id });
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