import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Fragment, useState } from "react";

import { Listbox, Transition } from '@headlessui/react'
import { DownSquareOutlined } from "@ant-design/icons";
import { Check, ChevronDown } from "lucide-react";

const defaultTags = [
    {tag: "all", color: "#6b7280"},
    {tag: "picture", color: "#4ade80"},
    {tag: "video", color: "#60a5fa"},
    {tag: "document", color: "#facc15"},
    {tag: "audio", color: "#f87171"},
    {tag: "other", color: "#c084fc"},
]

export function TagFilter({ filterTag, setFilterTag } : { filterTag: string[], setFilterTag: any }) {

    return (
        <>
        {/* <div className="flex gap-4 items-center">
            <Label htmlFor="typeSelect">Filter Tags</Label>
            <Select
                value={filterTag}
                onValueChange={(newType) => {
                    setFilterTag(newType);
                }}
            >
                <SelectTrigger id="tagSelect" className="w-[180px]">
                    <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="picture">Picture</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="word">Word</SelectItem>
                </SelectContent>
            </Select>
        </div> */}
        <div className="flex gap-4 items-center">
            <Label>Filter Tags</Label>
            <Listbox value={filterTag} onChange={(value) => {
                if (value.includes("all")) {
                    setFilterTag(["all"]);
                } else {
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
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {defaultTags.map((tag) => (
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
                                        </div>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    </>
    )
}