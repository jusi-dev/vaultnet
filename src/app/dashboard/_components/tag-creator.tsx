import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addTagToFile } from "@/actions/aws/files";

const formSchema = z.object({
    tag: z.string().min(1).max(20),
    color: z.string().min(1).max(7),
})

export function TagCreator({ isTagOpen, setIsTagOpen, file }: { isTagOpen: boolean, setIsTagOpen: any, file: any }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          tag: "Unnamed",
          color: "#000000",
        },
      })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        addTagToFile(file.fileId, values.tag.toLowerCase(), values.color)
        form.reset()
        setIsTagOpen(false)
        window.dispatchEvent(new CustomEvent('fileUploaded'));
    }

    return (
        <Dialog open={isTagOpen} onOpenChange={(isOpen) => {
            setIsTagOpen(isOpen)
            form.reset()
        }}>
            <DialogContent className="bg-white p-4">
                <DialogTitle>Create a new tag</DialogTitle>
                <DialogDescription>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="tag"
                                render={({ field}) => (
                                <FormItem>
                                    <FormLabel>Create a tag</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field}) => (
                                <FormItem>
                                    <FormLabel>Choose a color: {form.getValues("color")}</FormLabel>
                                        <FormControl>
                                            <Input type="color" {...field} />
                                        </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit"
                                disabled={form.formState.isSubmitting} className="flex gap-1">
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
                                Share
                            </Button>
                        </form>
                    </Form>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}