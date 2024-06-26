"use client"

import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
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
import { fileTypes } from "../../../../convex/schema";
import { Doc } from "../../../../convex/_generated/dataModel";
import { createFileInDB, createPresignedUploadUrl } from "@/actions/aws/files";
import { unstable_renderSubtreeIntoContainer } from "react-dom";

const formSchema = z.object({
  title: z.string().min(0).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, "Required"),
})


export function UploadButton(orgOrUser: any) {
  const { toast } = useToast();
  const organization = useOrganization();
  const user = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  })

  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let encryptionKey;
    let encryptionKeyMD5;

    if (!orgOrUser.orgOrUser.id) {
      console.log("Haut doch NID dr Latz")
        encryptionKey = orgOrUser!.publicMetadata?.encryptionKeyBase64 as string;
        encryptionKeyMD5 = orgOrUser!.publicMetadata?.encryptionKeyMD5Base64 as string;
    } else {
        console.log("Haut doch dr Latz")
        encryptionKey = orgOrUser!.orgOrUser?.publicMetadata?.encryptionKeyBase64 as string;
        encryptionKeyMD5 = orgOrUser!.orgOrUser?.publicMetadata?.encryptionKeyMD5Base64 as string;
    }

    console.log("This is the userOrgObject of upload-button: ", orgOrUser);
    console.log("This is the org id: ", orgOrUser.orgOrUser.id);

    console.log("This is the encryption key from upload-button: ", encryptionKey);

    if(!orgId) return;

    const fileType = values.file[0].type;
    const fileExtension = values.file[0].name.split('.').pop();
    const fileName = values.file[0].name;
    const fileSize = values.file[0].size;

    const fileData = {
      fileType,
      fileExtension,
      fileName,
      fileSize,
    }

    const response = await createPresignedUploadUrl(orgId, fileData, encryptionKey, encryptionKeyMD5)
    
    if ('error' in response) {
      if(response.error === 909) {
        return toast({
          variant: "destructive",
          title: "You have insufficent space left",
          description: "Please delete some files to free up space or activate pay as you go.",
        })
      } else {
        return toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Your file could not be uploaded. Please try again later.",
        })
      }
    }

    const uploadResponseFileKey = response.fileKey;
    const uploadURL = response.uploadUrl;

    let headers;

    if (encryptionKey) {
      headers = {
        'Content-Type': values.file[0].type as string,
        'x-amz-server-side-encryption-customer-algorithm': 'AES256',
        'x-amz-server-side-encryption-customer-key': encryptionKey,
        'x-amz-server-side-encryption-customer-key-MD5': encryptionKeyMD5,
      }
    } else {
      headers = {
        'Content-Type': values.file[0].type as string,
      }
    }

    const uploadResponse = await fetch(uploadURL, {
      method: 'PUT',
      body: values.file[0],
      headers,
    })

    // const uploadResponseFileKey = await uploadToS3(values.file[0]);

    const types = {
      "image/png": "image",
      "image/jpeg": "image",
      "application/pdf": "pdf",
      "text/csv": "csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "excel",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "word",
    } as Record<string, Doc<'files'>['type']>

    try {
      await createFileInDB(
        values.title ? values.title : values.file[0].name,
        uploadResponseFileKey,
        orgId,
        types[fileType],
        fileSize,
        encryptionKey ? true : false,
      )

      form.reset();

      setIsFileDialogOpen(false);

      window.dispatchEvent(new CustomEvent('fileUploaded'));
  
      toast({
        variant: "success",
        title: "File Uploaded",
        description: "Your file has been uploaded successfully",
      })
    } catch (error) {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Your file could not be uploaded. Please try again later.",
        })
    }

  }

  let orgId : string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  return (
    <Dialog open={isFileDialogOpen} onOpenChange={(isOpen) => {
        setIsFileDialogOpen(isOpen);
        form.reset();
    }}>
        <DialogTrigger asChild>
          <Button onClick={()=> {
              }}>Upload File
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
              <DialogTitle className="mb-8">Upload your File</DialogTitle>
              <DialogDescription>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field}) => (
                        <FormItem>
                            <FormLabel>Title (optional):</FormLabel>
                            <FormControl>
                              <Input placeholder="hello world" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="file"
                        render={() => (
                        <FormItem>
                            <FormLabel>Choose a File:</FormLabel>
                            <FormControl>
                              <Input 
                                  type="file"  {...fileRef}
                              />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit"
                        disabled={form.formState.isSubmitting} className="flex gap-1">
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
                        Submit
                    </Button>
                    </form>
                </Form>
              </DialogDescription>
          </DialogHeader>
        </DialogContent>
    </Dialog>
  );
}
