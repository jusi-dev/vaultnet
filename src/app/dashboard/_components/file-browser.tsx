"use client"

import { clerkClient, currentUser, useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { GridIcon, ListIcon, Loader2 } from "lucide-react";
import { SearchBar } from "./search-bar";
import { useCallback, useEffect, useState } from "react";
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
import { getAllFavorites, getFilesFromAWS } from "@/actions/aws/files";
import { set } from "date-fns";
import { getSessionStorage, setSessionStorage } from "@/hooks/useSessionStorage";
import { TagFilter } from "./tag-filter";
import { getClerkUser, removeEncryptionKeyToUser, setEncryptionKeyToUser } from "@/actions/aws/users";


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

  interface File {
    fileId: string;
    title: string;
    type: string;
    userId: string;
    isFavorited: boolean;
  }

  const [files, setFiles] = useState<File[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [filterTag, setFilterTag] = useState(["all"] as string[]);

  let orgId = organization.isLoaded && user.isLoaded ? (organization.organization?.id ?? user.user?.id) : undefined;
  let orgOrUser = organization.isLoaded && user.isLoaded ? !organization.organization ? user.user : organization.organization : undefined;

  const fetchFiles = useCallback(() => {
    if (orgId) {
      setIsLoading(true);
      getFilesFromAWS({
        orgId,
        query,
        favorites: filterFavorites,
        deletedOnly,
        type: type === "all" ? undefined : type,
        filterTag: filterTag.includes("all") ? undefined : filterTag,
      }).then((fetchedFiles) => {
        setFiles(fetchedFiles as File[]);
        setIsLoading(false);
      });
    }
  }, [orgId, query, filterFavorites, deletedOnly, type, filterTag]);

  const fetchFavorites = useCallback(() => {
    if (orgId) {
      getAllFavorites(orgId).then((favorites) => {
        if (!favorites) return [];
        setFavorites(favorites);
      });
    }
  }, [orgId]);

  useEffect(() => {
    // Inital set loading
    setIsLoading(true);

    // Set up the event listener for file upload events
    window.addEventListener('fileUploaded', fetchFiles);

    // Fetch files initially
    console.log("Fetching files form browser")
    fetchFavorites();
    fetchFiles()

    // Clean up the event listener when the component unmounts
    return () => {
        window.removeEventListener('fileUploaded', fetchFiles);
    };
  }, [orgId, query, filterFavorites, deletedOnly, type, filterTag]);

  const modifiedFiles = files.map(file => ({
    ...file,
    isFavorited: (favorites?.some(f => f.fileId === file.fileId) ?? false)
  }));


  return (
    <div>
        <>
          <div className="flex flex-col gap-y-4 md:flex-row justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">{title}</h1>
            <SearchBar query={query} setQuery={setQuery} />
            <UploadButton orgOrUser={orgOrUser}/>
          </div>
          <Tabs defaultValue="grid" className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-center">
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
              <TagFilter filterTag={filterTag} setFilterTag={setFilterTag}/>
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
                {modifiedFiles?.map((file) => {
                  return <FileCard key={file.fileId} file={file} user={orgOrUser} />;
                })}
              </div>
            </TabsContent>

            <TabsContent value="list">
              <DataTable columns={columns} data={modifiedFiles} />
            </TabsContent>
          </Tabs>

          {files?.length === 0 && !isLoading && <Placeholder />}
        </>
    </div>
  );
}
