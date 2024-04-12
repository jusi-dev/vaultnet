"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, StarIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideNav() {
  const path = usePathname();

    return (
        <div className="md:w-40 flex md:flex-col gap-4 flex-row flex-wrap md:flex-nowrap">
          <Link href="/dashboard/files">
            <Button variant={"link"} className={clsx("flex gap-2", {
              "text-orange-500": path === "/dashboard/files",
            })}>
              <FileIcon /> All Files
            </Button>
          </Link>
          <Link href="/dashboard/favorites">
            <Button variant={"link"} className={clsx("flex gap-2", {
              "text-orange-500": path === "/dashboard/favorites",
            })}>
              <StarIcon /> Favorites
            </Button>
          </Link>
          <Link href="/dashboard/trash">
            <Button variant={"link"} className={clsx("flex gap-2", {
              "text-orange-500": path === "/dashboard/trash",
            })}>
              <Trash2 /> Deleted Files
            </Button>
          </Link>
        </div>
    )
}