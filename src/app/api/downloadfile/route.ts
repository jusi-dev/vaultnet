import {formidable, IncomingForm} from 'formidable';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextApiResponse } from 'next';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { currentUser, useOrganization } from '@clerk/nextjs';
import { decryptAndDownloadURL } from '@/app/dashboard/_components/file-actions';
import { getFilesFromAWS, getSingleFile } from '@/actions/aws/files';


const createPresignedUrlWithClient = async (key : string, orgEncryptionKey: string, orgEncryptionKeyMD5: string) => {
    const client = new S3Client();

    let encryptionKey;
    let encryptionKeyMD5;

    const user = await currentUser();

    const file = await getSingleFile(key);

    if (!file) {
      throw new Error("File not found");
    }

    // while (!organization.isLoaded) {
    //   await new Promise((resolve) => setTimeout(resolve, 100));
    //   console.log("Waiting for organization to load")
    // }

    if (orgEncryptionKey == '') {
      encryptionKey = user?.publicMetadata?.encryptionKeyBase64 as string;
      encryptionKeyMD5 = user?.publicMetadata?.encryptionKeyMD5Base64 as string;
    } else {
      encryptionKey = orgEncryptionKey
      encryptionKeyMD5 = orgEncryptionKeyMD5
    }

    // Check if file is encrypted

    let command;

    if (file.isEncrypted) {
      command = new GetObjectCommand({
        Bucket: "vaultnet", 
        Key: key,
        SSECustomerAlgorithm: encryptionKey && "AES256",
        SSECustomerKey: encryptionKey && encryptionKey,
        SSECustomerKeyMD5: encryptionKeyMD5 && encryptionKeyMD5,
      });
    } else {
      command = new GetObjectCommand({
        Bucket: "vaultnet", 
        Key: key
      });
    }

    const url = await getSignedUrl(client, command, { expiresIn: 36000 });
    return url;
}

export async function POST(req : Request, res: NextApiResponse){
    const formData = await req.formData();
    const fileId = formData.get('fileId');
    const encryptionKey = formData.get('encryptionKey') as string || '';
    const encryptionKeyMD5 = formData.get('encryptionKeyMD5') as string || '';

    
    if (!fileId) {
      return new Response('No file found', { status: 400 });
    }

    try {
        const downloadUrl = await createPresignedUrlWithClient(fileId as string, encryptionKey, encryptionKeyMD5);

        return new Response(JSON.stringify({
            downloadUrl
        }), { status: 200 });
    } catch (uploadError) {
      return new Response(JSON.stringify({error: uploadError}), { status: 500 });
    };
}

POST.config = {
    api: {
      bodyParser: false, // Disabling the default bodyParser
    },
  };
