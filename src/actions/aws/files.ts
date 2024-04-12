'use server';

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getUserById, getUserId } from "./users";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";


const dbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dbClient);


async function hasAccessToOrg(orgId: string) {
    const userId = await getUserId();

    if (!userId) {
        return null;
    }

    const user = await getUserById(userId);

    if (!user) {
        return null;
    }

    console.log(user.orgIds)
    console.log(user.userid)
    console.log(orgId)
    const hasAccess = user.orgIds?.some((item: any) => item.orgId === orgId) || user.userid.includes(orgId)
    console.log("User has access: ", hasAccess)

    if (!hasAccess) {
        return null;
    }

    return { user };
}

export const createFileInDB = async (name: string, fileId: string, orgId: string, type: string) => {
    let date = new Date(Date.UTC(2024, 3, 11, 13, 22, 27));
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
            _creationTime: date.getTime()
        }
    });

    const response = await docClient.send(updateCommand);
    console.log(response)
}

export const getFilesFromAWS = async (orgId: string, query?: string, favorites?: boolean, deletedOnly?: boolean, type?: string) => {
    const hasAccess = await hasAccessToOrg(orgId)

    console.log("Is deletedOnly true: ", deletedOnly)

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

    console.log("These are the files: ", files)
    return files;
}

export const hasAccessToFile = async (fileId: string) => {
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

const getSingleFile = async (fileId: string) => {
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

    await docClient.send(new PutCommand({
        TableName: 'vaultnet-files',
        Item: {
            ...file,
            shouldDelete: true
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