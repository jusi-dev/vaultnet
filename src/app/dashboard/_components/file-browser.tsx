"use client"

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { GridIcon, ListIcon, Loader2 } from "lucide-react";
import { SearchBar } from "./search-bar";
import { useState } from "react";
import { DataTable } from "./file-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Doc } from "../../../../convex/_generated/dataModel";
import { Label } from "@/components/ui/label";


function Placeholder() {
  return (
      <div className=" flex flex-col gap-8 w-full h-full items-center mt-24">
        <Image src="/empty.svg" width={300} height={300} alt="file" />
        <p className="text-1xl font-bold text-center text-gray-400">There are no files yet. <br/> Go and Upload your first file.</p>
        <UploadButton />
      </div>
  )
}

export function FileBrowser({ title, filterFavorites, deletedOnly }: { title: string, filterFavorites?: boolean, deletedOnly?: boolean }) {
  const organization = useOrganization();
  const user = useUser();

  const [query, setQuery] = useState<string>("");
  const [type, setType] = useState<Doc<"files">["type"] | 'all'>("all");

  let orgId : string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const favorites = useQuery(api.files.getAllFavorites, 
    orgId ? { orgId } : 'skip',
  );

  const files = useQuery(
    api.files.getFiles,
    orgId
      ? {
          orgId,
          type: type === "all" ? undefined : type,
          query,
          favorites: filterFavorites,
          deletedOnly,
        }
      : "skip"
  );

  const isLoading = files === undefined;

  const modifiedFiles = files?.map(file => ({
    ...file,
    isFavorited: (favorites ?? []).some(f => f.fileId === file._id)
  })) ?? [];

  return (
    <div>
      {!isLoading && (
        <>
          <div className="flex flex-col gap-y-4 md:flex-row justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">{title}</h1>
            <SearchBar query={query} setQuery={setQuery} />
            <UploadButton />
          </div>

          <Tabs defaultValue="grid" className="w-full">
            <div className="flex justify-between items-center">
              <TabsList className="mb-4">
                <TabsTrigger value="grid" className="flex gap-1 items-center">
                  <GridIcon /> Grid
                </TabsTrigger>
                <TabsTrigger value="list" className="flex gap-1 items-center">
                  <ListIcon /> List
                </TabsTrigger>
              </TabsList>
              <div className="flex gap-4 items-center">
                <Label htmlFor="typeSelect">Filter Type</Label>
                <Select
                  value={type}
                  onValueChange={(newType) => {
                    setType(newType as Doc<"files">["type"] | "all");
                  }}
                >
                  <SelectTrigger id="typeSelect" className="w-[180px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="word">Word</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading && (
              <div className=" flex flex-col gap-8 w-full h-full items-center mt-24">
                <Loader2 className="h-32 w-32 animate-spin" />
                <p className="text-3xl text-center text-gray-700">
                  Loading your files...
                </p>
              </div>
            )}

            <TabsContent value="grid">
              <div className="grid md:grid-cols-3 gap-4">
                {modifiedFiles?.map((files) => {
                  return <FileCard key={files._id} file={files} />;
                })}
              </div>
            </TabsContent>

            <TabsContent value="list">
              <DataTable columns={columns} data={modifiedFiles} />
            </TabsContent>
          </Tabs>

          {files?.length === 0 && <Placeholder />}
        </>
      )}
    </div>
  );
}
