import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Fragment, useEffect, useState } from "react";

import { Listbox, Transition } from '@headlessui/react'
import { DownSquareOutlined } from "@ant-design/icons";
import { Check, ChevronDown } from "lucide-react";
import { getCustomTags } from "@/actions/aws/users";

const defaultTags = [
    {tag: "all", color: "#6b7280"},
    {tag: "picture", color: "#4ade80"},
    {tag: "video", color: "#60a5fa"},
    {tag: "document", color: "#facc15"},
    {tag: "audio", color: "#f87171"},
    {tag: "other", color: "#c084fc"},
]

export function TagFilter({ filterTag, setFilterTag } : { filterTag: string[], setFilterTag: any }) {
    const [customTags, setCustomTags] = useState([]);

    useEffect(() => {
        getCustomTags().then((tags) => {
            setCustomTags(tags);
        })
    }, [filterTag])

    return (
        <div className="flex gap-4 items-center">
            <Label>Filter Tags</Label>
            <Listbox value={filterTag} onChange={(value) => {
                // Check if latest value in array is "all"
                if (value[value.length - 1] === "all") {
                    setFilterTag(["all"]);
                } else {
                    // Remove "all" from the array
                    if (value.includes("all")) {
                        value.splice(value.indexOf("all"), 1);
                    }
                    setFilterTag(value);
                }
            }} multiple>
                <div className="relative mt-1">
                    <Listbox.Button className="flex h-10 w-44 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                        <span className="block truncate">{
                            // Seperate the tags with a comma
                            filterTag.length > 1 ? filterTag.slice(0, 2).join(", ") + "..." :
                            filterTag
                        }</span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {/* {defaultTags.map((tag) => (
                                <Listbox.Option key={tag.tag} value={tag.tag}
                                    className="relative cursor-default select-none py-2 pl-10 pr-4"
                                >
                                    {({ active, selected }) => (
                                        <div className={`flex items-center cursor-pointer ${active && "text-orange-500"} ${selected && "text-orange-500"}`}>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <Check className="h-5 w-5" />
                                                </span>
                                                ) : null
                                            }
                                            {tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1)}
                                            <div className="w-5 h-2 ml-auto mr-2" style={{backgroundColor: `${tag.color}`}}></div>
                                        </div>
                                    )}
                                </Listbox.Option>
                            ))} */}
                            {/* <div className="w-full text-bold flex items-center justify-center py-1 border-y-2 border-gray-500">
                                <p>- Own Tags -</p>
                            </div> */}
                            <Listbox.Option key="all" value="all"
                                className="relative cursor-default select-none py-2 pl-10 pr-4"
                            >
                                {({ active, selected }) => (
                                    <div className={`flex items-center cursor-pointer ${active && "text-orange-500"} ${selected && "text-orange-500"}`}>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Check className="h-5 w-5" />
                                            </span>
                                        ) : null}
                                        All
                                        <div className="w-5 h-2 ml-auto mr-2" style={{backgroundColor: "#6b7280"}}></div>
                                    </div>
                                )}
                            </Listbox.Option>
                            {customTags.map((tag) => (
                                <Listbox.Option key={(tag as { tag: string }).tag} value={(tag as { tag: string }).tag}
                                    className="relative cursor-default select-none py-2 pl-10 pr-4"
                                >
                                    {({ active, selected }) => (
                                        <div className={`flex items-center cursor-pointer ${active && "text-orange-500"} ${selected && "text-orange-500"}`}>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <Check className="h-5 w-5" />
                                                </span>
                                            ) : null}
                                            {(tag as { tag: string, color: string }).tag.charAt(0).toUpperCase() + (tag as { tag: string, color: string }).tag.slice(1)}
                                            <div className="w-5 h-2 ml-auto mr-2" style={{backgroundColor: `${(tag as { tag: string, color: string }).color}`}}></div>
                                        </div>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    )
}