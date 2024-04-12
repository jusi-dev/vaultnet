import {formidable, IncomingForm} from 'formidable';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextApiResponse } from 'next';
import { updatedMbsUploaded } from '@/actions/aws/users';
import { currentUser } from '@clerk/nextjs';

const s3Client = new S3Client();

export async function POST(req : Request, res: NextApiResponse){

    const formData = await req.formData();

    const file = formData.get('file');
    const orgId = formData.get('orgId');
    
    if (!file || !orgId) {
      return new Response('No file found', { status: 400 });
    }

    const buffer = Buffer.from(await (file as unknown as File).arrayBuffer())

    const fileExtension = (file as unknown as File).name.split('.').pop();
    const fileKey = `${(file as unknown as File).name}_${orgId}_${Math.floor(Math.random() * 10000)}.${fileExtension}`;

    const updateSizeData = {
      fileSize: (file as unknown as File).size
    }

    try {
      await updatedMbsUploaded(updateSizeData)
    } catch (error) {
      return new Response(JSON.stringify({error: 909}), { status: 500 });
    }

    try {
      const uploadCommand = new PutObjectCommand({
        Body: buffer,
        Bucket: "vaultnet",
        Key: fileKey, 
        Metadata: {
          'OrgId': orgId as string,
        },
        ContentType: (file as unknown as File).type
      });

      await s3Client.send(uploadCommand);

      return new Response(JSON.stringify({
        fileKey
      }), { status: 200 });
    } catch (uploadError) {
      return new Response(JSON.stringify({error: 'File upload failed ' + uploadError}), { status: 500 });
    };
}

POST.config = {
  api: {
    bodyParser: false, // Disabling the default bodyParser
  },
};
