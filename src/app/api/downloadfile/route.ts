import {formidable, IncomingForm} from 'formidable';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextApiResponse } from 'next';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


const createPresignedUrlWithClient = (key : string) => {
    const  client = new S3Client();
    const command = new GetObjectCommand({ Bucket: "vaultnet", Key: key });
    return getSignedUrl(client, command, { expiresIn: 36000 });
}

export async function POST(req : Request, res: NextApiResponse){
    const formData = await req.formData();
    const fileId = formData.get('fileId');
    const orgId = formData.get('orgId');
    
    if (!fileId || !orgId) {
      return new Response('No file found', { status: 400 });
    }

    try {
        const downloadUrl = await createPresignedUrlWithClient(fileId as string);

        return new Response(JSON.stringify({
            downloadUrl
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
