import { addTagToFile, getFileTags, removeTagFromFile } from "@/actions/aws/files";
import { addTagToUser, deleteTagFromUser, getCustomTags, getMe, setInitinalTagsTrue } from "@/actions/aws/users";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { CheckIcon, Mail, MessageSquare, Plus, PlusCircle, TagIcon, Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

const defaultTags = [
    {tag: "picture", color: "#4ade80"},
    {tag: "video", color: "#60a5fa"},
    {tag: "document", color: "#facc15"},
    {tag: "audio", color: "#f87171"},
    {tag: "other", color: "#c084fc"},
]

export default function TagManager({file, setIsTagOpen} : {file: any, setIsTagOpen: any}) {
    const [fileTags, setFileTags] = useState(file.tags)
    const [defaultTagsFiltered, setDefaultTagsFiltered] = useState([])

    const filterTags = async () => {
        const allTags = await getCustomTagsFromUser()

        // Filter out the tags that are already in the file.tags
        const defaultTagsFiltered = allTags.filter((tag: any) => {
            if (file.tags?.filter((fileTag: any) => fileTag.tag === tag.tag).length === 0 || file.tags === undefined) {
                return tag
            }
        })
        setDefaultTagsFiltered(defaultTagsFiltered)
    }

    const getCustomTagsFromUser = async () => {
        const customTags = await getCustomTags()

        if (customTags.length === 0 || customTags === undefined) {
            const user = await getMe()
            if (user.setInitinalTagsTrue === false || user.setInitinalTagsTrue === undefined) {
                await setInitinalTagsTrue()
                return defaultTags
            } else {
                return [];
            }
        } else {
            return customTags;
        }
    }

    useEffect(() => {
        filterTags()
    }, [file])

    return (
        <>   
            {fileTags?.map((tag: any) => (
                <DropdownMenuItem key={tag.tag} onClick={() => {
                    removeTagFromFile(file.fileId, tag.tag)

                    // Update the fileTags state
                    setFileTags(fileTags.filter((fileTag: any) => fileTag.tag !== tag.tag))
                    window.dispatchEvent(new CustomEvent('fileUploaded'));
                }}>
                    <div className="flex items-center p-2 my-1 cursor-pointer" style={{backgroundColor: tag.color}}>
                        <p className="text-white text-left flex gap-2"><CheckIcon /> {tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1)}</p>
                    </div>
                </DropdownMenuItem>
            ))}

            {/* Only display the default tags which are not contained in the file.tags */}
            {defaultTagsFiltered.map((tag: any) => (
                <DropdownMenuItem key={tag.tag}>
                    <div className="flex w-full items-center justify-center p-2 my-1 cursor-pointer" style={{backgroundColor: tag.color}}>
                        <div className="w-full text-white hover:drop-shadow-[0_3px_3px_rgba(255,255,255,0.5)]" onClick={() => {
                            addTagToFile(file.fileId, tag.tag, tag.color)
                            window.dispatchEvent(new CustomEvent('fileUploaded'));
                        }}>
                            <p className="text-center flex gap-2">{tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1)}</p>
                        </div>
                        <div className="ml-auto" onClick={async () => {
                            await deleteTagFromUser(tag.tag)
                        }}>
                            <Trash2 className="w-5 h-5 text-white hover:text-red-400"/>
                        </div>
                    </div>
                </DropdownMenuItem> 
            ))}

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsTagOpen(true)}>
                <div className="flex gap-1 items-center">
                    <PlusCircle className="w-4 h-4"/> Create Tag
                </div>
            </DropdownMenuItem>
        </>
    )
}