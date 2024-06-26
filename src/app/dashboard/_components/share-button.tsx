"use client"

import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { z } from "zod"
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { CopyToClipboard } from "./clipboard";
import { createShareLink } from "@/actions/aws/files";

const formSchema = z.object({
  days: z.string().min(1).max(1),
})

export function ShareButton({ isShareOpen, setIsShareOpen, fileId, orgOrUser }: { isShareOpen: boolean, setIsShareOpen: any, fileId: string, orgOrUser: any}) {
  const { toast } = useToast();
  const organization = useOrganization();
  const user = useUser();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      days: "3",
    },
  })

  const createShareUrl = async (shareTime: number) => {
    if (!orgId) {
      return null;
    }

    let encryptionKey;
    let encryptionKeyMD5;

    console.log("Test Output")

    if (!orgOrUser?.id) {
        encryptionKey = orgOrUser!.publicMetadata?.encryptionKeyBase64 as string;
        encryptionKeyMD5 = orgOrUser!.publicMetadata?.encryptionKeyMD5Base64 as string;
    } else {
        encryptionKey = orgOrUser?.publicMetadata?.encryptionKeyBase64 as string;
        encryptionKeyMD5 = orgOrUser?.publicMetadata?.encryptionKeyMD5Base64 as string;
    }

    console.log("Creating share link")
    console.log("This is the orgOrUser: ", orgOrUser)
    const shareUrl = await createShareLink(fileId, shareTime, encryptionKey, encryptionKeyMD5);

    console.log("Share URL: ", shareUrl)


    // const shareUrl = await getFileUrl(fileId, shareTime);

    const formData = new FormData();
    await formData.append('targetLink', shareUrl as string);

    const res = await fetch('/share/generate', {
        method: 'POST',
        body: formData
    }).then(res => res.json())

    return res.shareUrl as string || '';
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) return;

    try {
        const daysInSeconds = parseInt(form.getValues("days")) * 24 * 60 * 60;
        const shareUrlId = await createShareUrl(daysInSeconds);
        console.log("Share URL ID: ", shareUrlId)
        

        setIsShared(true);
        setShareUrl(shareUrlId || '');

        toast({
            variant: "success",
            title: "File Uploaded",
            description: "Your file has been successfully shared",
        });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: `Your file could not be shared. Please try again later. ${error}`,
      });
    }
  }

  let orgId : string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const [isShared, setIsShared] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");

  return (
    <Dialog open={isShareOpen} onOpenChange={(isOpen) => {
        setIsShareOpen(isOpen);
        form.reset();
    }}>
        <DialogContent>
          <DialogHeader>
              <DialogTitle className="mb-2">Share File</DialogTitle>
              <DialogDescription>
                {!isShared ?
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="days"
                            render={({ field}) => (
                            <FormItem>
                                <FormLabel>How many days do you want to share your file: {form.getValues("days")} Days. <br/>
                                  <span className="text-xs italic text-red-400">Your file will be decrypted and may be publicly accessible.</span>
                                </FormLabel>
                                    <FormControl>
                                        <Input type="range" min={"1"} max={"7"} {...field}/>
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
                : 
                <div>
                  <p className="mb-2">Your file has been shared for {form.getValues("days")} days.</p>
                  <CopyToClipboard copyValue={shareUrl.toString()} />
                </div>
                }
              </DialogDescription>
          </DialogHeader>
        </DialogContent>
    </Dialog>
  );
}
