import { addTagToFile, getFileTags, removeTagFromFile } from "@/actions/aws/files";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { CheckIcon, Mail, MessageSquare, PlusCircle, TagIcon, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

const defaultTags = [
    {tag: "picture", color: "#4ade80"},
    {tag: "video", color: "#60a5fa"},
    {tag: "document", color: "#facc15"},
    {tag: "audio", color: "#f87171"},
    {tag: "other", color: "#c084fc"},
]

export default function TagManager({file} : {file: any}) {
    const [fileTags, setFileTags] = useState([] as any[])
    const [defaultTagsFiltered, setDefaultTagsFiltered] = useState(defaultTags)

    const getTags = async () => {
        const tags = await getFileTags(file.fileId)
        setFileTags(tags)

        // Filter out the tags that are already in the file.tags
        const defaultTagsFiltered = defaultTags.filter((tag: any) => {
            if (tags.filter((fileTag: any) => fileTag.tag === tag.tag).length === 0) {
                return tag
            }
        })
        setDefaultTagsFiltered(defaultTagsFiltered)
    }

    useEffect(() => {
        getTags()
    }, [file])

    return (
        <>
            {/* <DropdownMenuItem onClick={() => addTagToFile(file.fileId, "picture")}>
                <div className="flex bg-green-400 items-center justify-center p-2 my-1">
                    <p className="text-white text-center">Picture</p>
                </div>
            </DropdownMenuItem> */}
            
            {fileTags.map((tag: any) => (
                <DropdownMenuItem onClick={() => {
                    removeTagFromFile(file.fileId, tag.tag)

                    // Update the fileTags state
                    setFileTags(fileTags.filter((fileTag: any) => fileTag.tag !== tag.tag))
                    
                    }}>
                    <div className="flex items-center justify-center p-2 my-1" style={{backgroundColor: tag.color}}>
                    <p className="text-white text-center flex gap-2"><CheckIcon /> {tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1)}</p>
                </div>
                </DropdownMenuItem>
            ))}

            {/* Only display the default tags which are not contained in the file.tags */}
            {!fileTags ? <div></div> : defaultTagsFiltered.map((tag: any) => (
                <DropdownMenuItem onClick={() => {
                    addTagToFile(file.fileId, tag.tag, tag.color)
                    setFileTags([...fileTags, tag])
                }}>
                    <div className="flex items-center justify-center p-2 my-1" style={{backgroundColor: tag.color}}>
                        <p className="text-white text-center flex gap-2">{tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1)}</p>
                    </div>
                </DropdownMenuItem>
            
            ))}

            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <div className="flex gap-1 items-center">
                    <PlusCircle className="w-4 h-4"/> Add New Tag
                </div>
            </DropdownMenuItem>
        </>
    )
}