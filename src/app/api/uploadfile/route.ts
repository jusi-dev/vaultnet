import {formidable, IncomingForm} from 'formidable';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextApiResponse } from 'next';

const s3Client = new S3Client();

export async function POST(req : Request, res: NextApiResponse){

    const formData = await req.formData();

    const file = formData.get('file');
    const orgId = formData.get('orgId');
    
    if (!file || !orgId) {
      return new Response('No file found', { status: 400 });
    }

    const fileName = formData.get('fileName');

    const buffer = Buffer.from(await (file as unknown as File).arrayBuffer())

    console.log(file);
    console.log(fileName);

    const fileExtension = (file as unknown as File).name.split('.').pop();

    const fileKey = `${(file as unknown as File).name}_${orgId}_${Math.floor(Math.random() * 10000)}.${fileExtension}`;

    try {

      const uploadCommand = new PutObjectCommand({
        Body: buffer,
        Bucket: "vaultnet",
        Key: fileKey, 
        Metadata: {
          'OrgId': orgId as string,
          // 'Content-Type': (file as unknown as File).type
        },
        ContentType: (file as unknown as File).type
      });

      await s3Client.send(uploadCommand);

      return new Response(JSON.stringify({
        fileKey
      }), { status: 200 });
    } catch (uploadError) {
      return new Response('File upload failed ' + uploadError, { status: 500 });
    };
}

POST.config = {
  api: {
    bodyParser: false, // Disabling the default bodyParser
  },
};
