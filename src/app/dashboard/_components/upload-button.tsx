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
import { createFileInDB } from "@/actions/aws/files";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, "Required"),
})


export function UploadButton() {
  const { toast } = useToast();
  const organization = useOrganization();
  const user = useUser();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  })

  const fileRef = form.register("file");

  const uploadToS3 = async (file: File) => {
    if (!orgId) {
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', "fileName.txt");
    formData.append('orgId', orgId)
  
    const response = await fetch('/api/uploadfile', {
      method: 'POST',
      body: formData, // Pass the formData object directly
    });
  
    return response.json(); // Parse the JSON response
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    if(!orgId) return;

    const fileType = values.file[0].type;

    const uploadResponseFileKey = await uploadToS3(values.file[0]);

    const types = {
      "image/png": "image",
      "image/jpeg": "image",
      "application/pdf": "pdf",
      "text/csv": "csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "excel",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "word",
    } as Record<string, Doc<'files'>['type']>

    console.log("Creating DB entry")

    try {
      // await createFile({
      //   name: values.title,
      //   fileId: uploadResponseFileKey.fileKey,
      //   orgId,
      //   type: types[fileType],
      // });

      await createFileInDB(
        values.title,
        uploadResponseFileKey.fileKey,
        orgId,
        types[fileType],
      )

      console.log("DB entry created")

      form.reset();

      setIsFileDialogOpen(false);

      window.dispatchEvent(new CustomEvent('fileUploaded'));
  
      toast({
        variant: "success",
        title: "File Uploaded",
        description: "Your file has been uploaded successfully",
      })
    } catch (error) {
      if(uploadResponseFileKey.error === 909) {
        toast({
          variant: "destructive",
          title: "You have insufficent space left",
          description: "Please delete some files to free up space or activate pay as you go.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Your file could not be uploaded. Please try again later.",
        })
      }
    }

  }

  let orgId : string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
    console.log('This is the browser user id: ', user.user?.id)
  }

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  const createFile = useMutation(api.files.createFile);

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
                            <FormLabel>Title:</FormLabel>
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
