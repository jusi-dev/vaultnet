import { addTagToFile, getFileTags, removeTagFromFile } from "@/actions/aws/files";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { CheckIcon, Mail, MessageSquare, Plus, PlusCircle, TagIcon, UserPlus } from "lucide-react";
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

    const filterTags = () => {
        // Filter out the tags that are already in the file.tags
        if (file.tags === undefined || file.tags === null) {
            console.log("Nö")
            setDefaultTagsFiltered(defaultTags)
        } else {
            console.log("Tags are being filtered: ", file.tags)
            const defaultTagsFiltered = defaultTags.filter((tag: any) => {
                if (file.tags?.filter((fileTag: any) => fileTag.tag === tag.tag).length === 0) {
                    return tag
                }
            })
            setDefaultTagsFiltered(defaultTagsFiltered)
        } 
    }

    useEffect(() => {
        // getTags()
        filterTags()
    }, [file])

    return (
        <>   
            {fileTags?.map((tag: any) => (
                <DropdownMenuItem key={tag} onClick={() => {
                    removeTagFromFile(file.fileId, tag.tag)

                    // Update the fileTags state
                    setFileTags(fileTags.filter((fileTag: any) => fileTag.tag !== tag.tag))
                    window.dispatchEvent(new CustomEvent('fileUploaded'));
                    }}>
                    <div className="flex items-center justify-center p-2 my-1 cursor-pointer" style={{backgroundColor: tag.color}}>
                    <p className="text-white text-center flex gap-2"><CheckIcon /> {tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1)}</p>
                </div>
                </DropdownMenuItem>
            ))}

            {/* Only display the default tags which are not contained in the file.tags */}
            {defaultTagsFiltered.map((tag: any) => (
                <DropdownMenuItem key={tag} onClick={() => {
                    addTagToFile(file.fileId, tag.tag, tag.color)
                    window.dispatchEvent(new CustomEvent('fileUploaded'));
                    // setFileTags([...fileTags, tag])
                }}>
                    <div className="flex items-center justify-center p-2 my-1 cursor-pointer" style={{backgroundColor: tag.color}}>
                        <p className="text-white text-center flex gap-2">{tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1)}</p>
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