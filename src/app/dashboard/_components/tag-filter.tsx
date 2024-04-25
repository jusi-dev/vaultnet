import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export function TagFilter({ filterTag, setFilterTag } : { filterTag: string, setFilterTag: any }) {

    return (
        <div className="flex gap-4 items-center">
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
            </div>
    )
}