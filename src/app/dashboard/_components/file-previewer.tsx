import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

export function FilePreviewer({ isPreviewOpen, setIsPreviewOpen, file, fileUrl }: { isPreviewOpen: boolean, setIsPreviewOpen: any, file: any, fileUrl: string }) {

    return (
            <Dialog open={isPreviewOpen} onOpenChange={(isOpen) => {
                    setIsPreviewOpen(isOpen)
                }}
            >
                <DialogContent className="bg-white p-4 h-[90vh] min-w-[90vw]">
                    <DialogTitle>{file.name}</DialogTitle>
                    <DialogDescription className="min-h-[100%] h-[80vh] bg-red-400">
                        <DocViewer
                            prefetchMethod="GET"
                            documents={[{ uri: fileUrl }]} 
                            pluginRenderers={DocViewerRenderers}
                            style={{ }}
                            config={{
                                header: {
                                    disableHeader: true,
                                    disableFileName: true,
                                },
                            }}
                        />
                    </DialogDescription>
                </DialogContent>
            </Dialog>
    )
}