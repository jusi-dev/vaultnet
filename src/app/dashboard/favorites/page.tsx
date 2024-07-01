import { useQuery } from "convex/react";
import { FileBrowser } from "../_components/file-browser";
import { api } from "../../../../convex/_generated/api";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Favorites | VaultNet",
};

export default function FavoritesPage() {

    return (
        <div>
            <FileBrowser title="Favorites" filterFavorites={true}/>
        </div>
    )
}
