'use server';

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getSubscriptionStorage, getUserById, getUserId, updatedMbsUploaded } from "./users";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, MetadataDirective, PutObjectCommand, S3Client, ServerSideEncryption } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { currentUser, useUser } from "@clerk/nextjs";
import { Copy, Key } from "lucide-react";
import { Share } from "next/font/google";


const dbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dbClient);

const s3Client = new S3Client();


async function hasAccessToOrg(orgId: string, isCron?: boolean) {

    let userId;

    if (!isCron) {
        userId = await getUserId();

        if (!userId) {
            return null;
        }
    } else {
        userId = orgId;
    }

    const user = await getUserById(userId);

    if (!user) {
        return null;
    }

    const hasAccess = user.orgIds?.some((item: any) => item.orgId === orgId) || user.userid.includes(orgId)

    if (!hasAccess) {
        return null;
    }

    return { user };
}

export const createFileInDB = async (name: string, fileId: string, orgId: string, type: string, fileSize: number, isEncrypted?: boolean) => {
    let date = new Date();
    const hasAccess = await hasAccessToOrg(orgId)

    if (!hasAccess) {
        throw new Error("Not authorized")
    }

    // Create file in the database
    const updateCommand = new PutCommand({
        TableName: 'vaultnet-files',
        Item: {
            fileId,
            name,
            orgId,
            type,
            userId: hasAccess.user.userid,
            _creationTime: date.getTime(),
            fileSize,
            isEncrypted,
        }
    });

    const response = await docClient.send(updateCommand);
}

export const getFilesFromAWS = async (data: any) => {
    // orgId: string, query?: string, favorites?: boolean, deletedOnly?: boolean, type?: string, isCron?: boolean

    const { orgId, query, favorites, deletedOnly, type, isCron, filterTag } = data;
    const hasAccess = await hasAccessToOrg(orgId, isCron)

    if (!hasAccess) {
        return [];
    }

    const scanCommand = new ScanCommand({
        TableName: 'vaultnet-files',
        FilterExpression: "orgId = :orgId",
        ExpressionAttributeValues: {
            ":orgId": `${orgId}`,
        }
    });

    const fileOutput = await docClient.send(scanCommand);

    let files = fileOutput.Items;

    if (!files) {
        return [];
    }

    if (query) {
        files = files.filter(file => file.name.toLowerCase().includes(query.toLowerCase()))
    }

    if (favorites) {
        const favorites = await docClient.send(new ScanCommand({
            TableName: 'vaultnet-favorites',
            FilterExpression: "orgId = :orgId",
            ExpressionAttributeValues: {
                ":orgId": `${orgId}`,
            }
        }));

        files = files.filter(file => favorites.Items?.some(f => f.fileId === file.fileId))
    }

    if (deletedOnly) {
        files = files.filter(file => file.shouldDelete)
    } else {
        files = files.filter(file => !file.shouldDelete)
    }

    if (type) {
        files = files.filter(file => file.type === type)
    }

    if (filterTag) {
        filterTag.map((arrayTag: string) => {
            arrayTag.toLowerCase()
            files = files?.filter(file => file.tags?.some((fileTag: { tag: string }) => fileTag.tag === arrayTag));
        });
        // Map through the array and filter only the files that have the value
        // files = files.filter(file => file.tags?.some((fileTag: { tag: string }) => fileTag.tag === filterTag));
    }

    return files;
}

export const hasAccessToFile = async (fileId: string) => {
    console.log("Triggered hasAccessToFile")
    const file = await docClient.send(new GetCommand({
        TableName: 'vaultnet-files',
        Key: {
            fileId,
        }
    }))

    if (!file.Item) {
        return null;
    }

    const hasAccess = await hasAccessToOrg(file.Item.orgId);

    if (!hasAccess) {
        return null;
    }

    return { user: hasAccess.user, file: file.Item };
}

export const toggleFavorite = async (fileId: string) => {
    const access = await hasAccessToFile(fileId);

    if (!access) {
        throw new Error("Not authorized")
    }

    const file = await docClient.send(new GetCommand({
        TableName: 'vaultnet-favorites',
        Key: {
            fileId,
        }
    }));

    if (file.Item) {
        await docClient.send(new DeleteCommand({
            TableName: 'vaultnet-favorites',
            Key: {
                fileId,
            }
        }));
    } else {
        await docClient.send(new PutCommand({
            TableName: 'vaultnet-favorites',
            Item: {
                fileId,
                orgId: access.file.orgId,
                userId: access.user.userid
            }
        }));
    }
}

export const getAllFavorites = async (orgId: string) => {
    const hasAccess = await hasAccessToOrg(orgId)

    if (!hasAccess) {
        return [];
    }

    const scanCommand = new ScanCommand({
        TableName: 'vaultnet-favorites',
        FilterExpression: "orgId = :orgId",
        ExpressionAttributeValues: {
            ":orgId": `${orgId}`,
        }
    });

    const response = await docClient.send(scanCommand);

    return response.Items;
}

export const getSingleFile = async (fileId: string) => {
    const file = await docClient.send(new GetCommand({
        TableName: 'vaultnet-files',
        Key: {
            fileId,
        }
    }));
    return file.Item;

}

const canDeleteFile = (user: any, file: any) => {
    const canDelete = user.userid === file.userId || user.orgIds.some((item: any) => item.orgId === file.orgId);

    if (!canDelete){
        throw new Error("Not authorized");
    }
}

export const deleteFile = async (fileId: string) => {
    const access = await hasAccessToFile(fileId);

    if (!access) {
        throw new Error("Not authorized");
    }

    const file = await getSingleFile(fileId);

    canDeleteFile(access.user, file);
    const todaysDate = new Date();

    await docClient.send(new PutCommand({
        TableName: 'vaultnet-files',
        Item: {
            ...file,
            shouldDelete: true,
            deleteDate: todaysDate.getTime()
        }
    }));
}

export const restoreFile = async (fileId: string) => {
    const access = await hasAccessToFile(fileId);

    if (!access) {
        throw new Error("Not authorized");
    }

    const file = await getSingleFile(fileId);

    canDeleteFile(access.user, file);

    await docClient.send(new PutCommand({
        TableName: 'vaultnet-files',
        Item: {
            ...file,
            shouldDelete: false
        }
    }));
}

export const 
deleteFilePermanently = async (fileId: string, cronAuth: string, encryptionKey?: string, encryptionKeyMD5?: string, isFileEncrypted?: boolean) => {
    const file = await getSingleFile(fileId);

    if (cronAuth) {
        if (cronAuth !== process.env.TRIGGER_API_KEY) {
            throw new Error("Not authorized");
        }
    } else {
        const access = await hasAccessToFile(fileId);

        if (!access) {
            throw new Error("Not authorized");
        }
        canDeleteFile(access.user, file);
    }

    await docClient.send(new DeleteCommand({
        TableName: 'vaultnet-files',
        Key: {
            fileId,
        }
    }));

    await docClient.send(new DeleteCommand({
        TableName: 'vaultnet-favorites',
        Key: {
            fileId,
        }
    }));

    // TODO: Add the encryption key if needed

    let headParams;

    if (isFileEncrypted === true) {
        headParams = {
            Bucket: "vaultnet",
            Key: fileId,
            SSECustomerAlgorithm: encryptionKey && "AES256",
            SSECustomerKey: encryptionKey && encryptionKey,
            SSECustomerKeyMD5: encryptionKeyMD5 && encryptionKeyMD5,
        }
    } else {
        headParams = {
            Bucket: "vaultnet",
            Key: fileId,
        }
    }

    const deleteParams = {
        Bucket: "vaultnet",
        Key: fileId,
    }

    const headData = await s3Client.send(new HeadObjectCommand(headParams))
    const fileSize = headData.ContentLength

    const fileData = {
        fileSize
    }

    await updatedMbsUploaded(fileData, false, file?.userId)

    // Delete from S3
    await s3Client.send(new DeleteObjectCommand(deleteParams))
}

export const createPresignedUploadUrl = async (orgId: string, fileData: any, encryptionKey: string, encryptionKeyMD5: string) => {
    const { fileSize, fileName, fileType, fileExtension } = fileData;

    if (!fileData || !orgId) {
        return { error: 'No file found', status: 400 };
    }

    const fileKey = `${fileName}_${orgId}_${Math.floor(Math.random() * 10000)}.${fileExtension}`;

    const fileSizeData = {
        fileSize
    }

    const userId = await getUserId();
    const user = await currentUser();

    try {
        await updatedMbsUploaded(fileSizeData, true, userId)
    } catch (error) {
        return { error: 909, status: 500 };
    }

    try {
        const command = new PutObjectCommand({
            Bucket: "vaultnet",
            Key: fileKey,
            ContentType: fileType as string,
            SSECustomerAlgorithm: encryptionKey && "AES256",
            SSECustomerKey: encryptionKey && encryptionKey,
            SSECustomerKeyMD5: encryptionKeyMD5 && encryptionKeyMD5,
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

        const responseData = {
            fileKey,
            uploadUrl,
            status: 200
        }

        return responseData
    } catch(err) {
        return { error: 'File upload failed ' + err, status: 500 };
    }
}

export const createPresignedDownloadUrl = async (fileId: string, user: any) => {
    const client = new S3Client();

    const userEncryptionKey = user.user?.publicMetadata?.encryptionKeyBase64 as string;
    const userEncryptionKeyMD5 = user.user?.publicMetadata?.encryptionKeyMD5Base64 as string;

    try {

        const command = new GetObjectCommand({ 
        Bucket: "vaultnet", 
        Key: fileId,
        SSECustomerAlgorithm: userEncryptionKey && "AES256",
        SSECustomerKey: userEncryptionKey && userEncryptionKey,
        SSECustomerKeyMD5: userEncryptionKeyMD5 && userEncryptionKeyMD5,
        });
        const url = await getSignedUrl(client, command, { expiresIn: 36000 });
        return url;
    } catch {
        throw new Error("File not found")
        return '';
    }
}

export const getFilesToDelete = async () => {
    const scanCommand = new ScanCommand({
        TableName: 'vaultnet-files',
        FilterExpression: "shouldDelete = :shouldDelete",
        ExpressionAttributeValues: {
            ":shouldDelete": true,
        }
    });

    const response = await docClient.send(scanCommand);

    return response.Items;
}

export const freeUpSpaceWhenExceeded = async (userId: string, cronAuth: string) => {
    let user = await getUserById(userId);

    if (!user) {
        return;
    }

    const userStorage = await getSubscriptionStorage(user.subscriptionType);

    if (user.mbsUploaded > userStorage.size) {
        const allFiles = await getFilesFromAWS({
            orgId: userId, 
            query: undefined, 
            favorites: undefined, 
            deletedOnly: true, 
            type: '', 
            isCron: true
        });
        console.log("All files: ", allFiles)

        while (user.mbsUploaded > userStorage.size && allFiles.length > 0) {
            // Get the biggest file of the allFiles array
            const biggestFile = allFiles.reduce((prev, current) => (prev.fileSize > current.fileSize) ? prev : current);

            console.log("Deleting file: ", biggestFile.fileId)
    
            await deleteFilePermanently(biggestFile.fileId, cronAuth);
            user = await getUserById(userId);  // Update the user's uploaded MBs
            console.log("User used space: ", user.mbsUploaded)
            allFiles.splice(allFiles.indexOf(biggestFile), 1);  // Remove the deleted file from the array
        }
    }

    if (user.mbsUploaded > userStorage.size) {
        const allFiles = await getFilesFromAWS({
            orgId: userId, 
            query: undefined, 
            favorites: undefined, 
            deletedOnly: false, 
            type: '', 
            isCron: true
        });
        console.log("All files: ", allFiles)

        while (user.mbsUploaded > userStorage.size && allFiles.length > 0) {
            const biggestFile = allFiles.reduce((prev, current) => (prev.fileSize > current.fileSize) ? prev : current);

            console.log("Deleting file: ", biggestFile.fileId)
    
            await deleteFilePermanently(biggestFile.fileId, cronAuth);
            user = await getUserById(userId);  // Update the user's uploaded MBs
            console.log("User used space: ", user.mbsUploaded)
            allFiles.splice(allFiles.indexOf(biggestFile), 1);  // Remove the deleted file from the array
        }
    }
}

export const addTagToFile = async (fileId: string, tag: string, color: string) => {
    
    const access = await hasAccessToFile(fileId);

    if (!access) {
        throw new Error("Not authorized");
    }

    const file = await getSingleFile(fileId);

    if (!file) {
        throw new Error("File not found");
    }

    const tags = file.tags || [];

    tags.push({
        color,
        tag
    });

    await docClient.send(new PutCommand({
        TableName: 'vaultnet-files',
        Item: {
            ...file,
            tags
        }
    }));
}

export const removeTagFromFile = async (fileId: string, tag: string) => {
    const access = await hasAccessToFile(fileId);

    if (!access) {
        throw new Error("Not authorized");
    }

    const file = await getSingleFile(fileId);

    if (!file) {
        throw new Error("File not found");
    }

    const tags = file.tags || [];

    const newTags = tags.filter((t: { tag: string }) => t.tag !== tag);

    await docClient.send(new PutCommand({
        TableName: 'vaultnet-files',
        Item: {
            ...file,
            tags: newTags
        }
    }));
}

export const getFileTags = async (fileId: string) => {
    const access = await hasAccessToFile(fileId);

    if (!access) {
        throw new Error("Not authorized");
    }

    const file = await getSingleFile(fileId);

    if (!file) {
        throw new Error("File not found");
    }

    return file.tags;
}

export const createShareLink = async (fileId: string, shareTime: number, encryptionKey: string, encryptionKeyMD5: string) => {
    const access = await hasAccessToFile(fileId);

    if (!access) {
        throw new Error("Not authorized");
    }

    const file = await getSingleFile(fileId);

    // Update file in db to disable isEncrypted
    await docClient.send(new PutCommand({
        TableName: 'vaultnet-files',
        Item: {
            ...file,
            isEncrypted: false
        }
    }));

    if (!file) {
        throw new Error("File not found");
    }

    if (file.isEncrypted) {
        // Copy the file
        const copyParams = {
            Bucket: "vaultnet",
            CopySource: `vaultnet/${fileId}`,
            Key: fileId,
            CopySourceSSECustomerAlgorithm: encryptionKey && 'AES256',
            CopySourceSSECustomerKey: encryptionKey && encryptionKey,
            CopySourceSSECustomerKeyMD5: encryptionKeyMD5 && encryptionKeyMD5,
        }

        await s3Client.send(new CopyObjectCommand(copyParams))
    }

    const presignedUrl = await getSignedUrl(s3Client, new GetObjectCommand({
        Bucket: "vaultnet",
        Key: fileId,
        }), { expiresIn: shareTime }); 

    return presignedUrl
}

export const setShareLink = async (shareId: string, targetLink: string) => {
    const command = new PutCommand({
        TableName: 'vaultnet-links',
        Item: {
            id: shareId,
            target: targetLink
        }
    });

    const response = await docClient.send(command);
}

export const getShareLink = async (shareId: string) => {
    const command = new GetCommand({
        TableName: 'vaultnet-links',
        Key: {
            id: shareId
        }
    });
    
    const response = await docClient.send(command);
    console.log(response);
    return {targetLink: response.Item?.target, fileName: response.Item?.fileName};
}