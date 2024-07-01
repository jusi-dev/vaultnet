import { FileBrowser } from "../_components/file-browser";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Trash | VaultNet",
};

export default function FavoritesPage() {

    return (
        <div>
            <FileBrowser title="Delete" deletedOnly/>
        </div>
    )
}
