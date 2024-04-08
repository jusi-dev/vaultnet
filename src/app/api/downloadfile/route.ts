import {formidable, IncomingForm} from 'formidable';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextApiResponse } from 'next';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const config = {
  api: {
    bodyParser: false, // Disabling the default bodyParser
  },
};

const createPresignedUrlWithClient = (key : string) => {
    const  client = new S3Client();
    const command = new GetObjectCommand({ Bucket: "vaultnet", Key: key });
    return getSignedUrl(client, command, { expiresIn: 36000 });
}

export async function POST(req : Request, res: NextApiResponse){

    const formData = await req.formData();

    // const file = formData.get('file');
    // const orgId = formData.get('orgId');
    // const fileName = formData.get('fileName');

    const fileId = formData.get('fileId');
    const orgId = formData.get('orgId');
    
    if (!fileId || !orgId) {
      return new Response('No file found', { status: 400 });
    }

    // const buffer = Buffer.from(await (file as unknown as File).arrayBuffer())
    // const fileExtension = (file as unknown as File).name.split('.').pop();

    // const fileKey = `${(file as unknown as File).name}_${orgId}_${Math.floor(Math.random() * 10000)}.${fileExtension}`;

    try {

    //   const uploadCommand = new PutObjectCommand({
    //     Body: buffer,
    //     Bucket: "vaultnet",
    //     Key: fileKey, 
    //     Metadata: {
    //       'OrgId': orgId as string,
    //       'Content-Type': (file as unknown as File).type
    //     }
    //   });

    //   await s3Client.send(uploadCommand);

        const downloadUrl = await createPresignedUrlWithClient(fileId as string);

        return new Response(JSON.stringify({
            downloadUrl
        }), { status: 200 });
    } catch (uploadError) {
      return new Response('File upload failed ' + uploadError, { status: 500 });
    };
}
