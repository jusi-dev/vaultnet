import { FileBrowser } from "../_components/file-browser";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Files | VaultNet",
};

export default function FilesPage() {
    return (
        <div>
            <FileBrowser title={"Your Files"} />
        </div>
    )
}