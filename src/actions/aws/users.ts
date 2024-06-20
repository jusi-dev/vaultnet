'use server';

import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { sub } from "date-fns";
import { addToPAYG } from "../stripe";
import { generateEncryptionKey } from "@/utils/crypto";

const dbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dbClient);

export const setEncryptionKeyToUser = async (userId: string) => {
    const { encryptionKeyBase64, encryptionKeyMD5Base64 } = await generateEncryptionKey();
    await clerkClient.users.updateUserMetadata(userId, { 
        publicMetadata: {
            encryptionKeyBase64,
            encryptionKeyMD5Base64
        }
     });
}

export const setEncryptionKeyToOrg = async (orgId: any) => {
    const { encryptionKeyBase64, encryptionKeyMD5Base64 } = await generateEncryptionKey();
    await clerkClient.organizations.updateOrganizationMetadata(orgId, {
        publicMetadata: {
            encryptionKeyBase64,
            encryptionKeyMD5Base64
        }
    })
}

export const removeEncryptionKeyToUser = async (userId: string) => {
    const { encryptionKeyBase64, encryptionKeyMD5Base64 } = await generateEncryptionKey();
    await clerkClient.users.updateUserMetadata(userId, { 
        publicMetadata: {
            encryptionKeyBase64: null,
            encryptionKeyMD5Base64: null
        }
     });
}


export const createUser = async (user: any) => {
    const command = new PutCommand({
        TableName: 'vaultnet-users',
        Item: {
            userid: user.id,
            image: user.image_url,
            name: `${user.first_name ?? ""} ${user.last_name ?? ""}`,
            orgIds: [],
            tokenIdentifier: `https://${process.env.CLERK_HOSTNAME}|${user.id}`,
            subscriptionType: "free",
            mbsUploaded: 0,
            payAsYouGo: false,
        }
    });
    const response = await docClient.send(command);

    await setEncryptionKeyToUser(user.id);
}

export const createEncryptionKeyForOrg = async (data: any) => {
    const orgId = data.organization.id;

    if (!data.organization.public_metadata.encryptionKeyBase64) {
        await setEncryptionKeyToOrg(orgId);
    }
}

export const updateUser = async (data: any) => {
   const userId = await getUser(data);

    const updateCommand = new PutCommand({
        TableName: 'vaultnet-users',
        Item: {
            ...userId,
            name: `${data.first_name ?? ""} ${data.last_name ?? ""}`,
            image: data.image_url
        }
    });

    await docClient.send(updateCommand);
}

export const updateSubscription = async (userId: any, customerId: string, subscriptionType: string, periodEnd: number, canceledSub?: boolean) => {
    const user = await getUserById(userId);

    // Remove periodEnd from user if canceled sub is true
    delete user.periodEnd;

    delete user.canceledSubscription;

    const updateCommand = new PutCommand({
        TableName: 'vaultnet-users',
        Item: {
            ...user,
            subscriptionType,
            customerId,
            canceledSubscription: canceledSub && periodEnd,
            periodEnd: !canceledSub ? periodEnd : null
        }
    });

    await docClient.send(updateCommand);
}

export const cancelSubscription = async (userId: any, periodEnd: any) => {
    const user = await getUserById(userId);

    const updateCommand = new PutCommand({
        TableName: 'vaultnet-users',
        Item: {
            ...user,
            canceledSubscription: periodEnd,
            periodEnd
        }
    });

    await docClient.send(updateCommand);
}

export const addOrgIdToUser = async (data: any) => {
    const userId = await isUserInOrg(data);

    const updateCommand = new PutCommand({
        TableName: 'vaultnet-users',
        Item: {
            ...userId,
            orgIds: [...userId.orgIds, { orgId: data.organization.id, role: data.role === "org:admin" ? "admin" : "member" }]
        }
    });

    await docClient.send(updateCommand);
}

export const updateRoleInOrgForUser = async (data: any) => {
    const userId = await isUserInOrg(data);

    const org = userId.orgIds.find((item: any) => item.orgId === data.organization.id);

    if (!org) {
        throw new Error("User is not a member of the organization");
    }

    org.role = data.role === "org:admin" ? "admin" : "member";

    const updateCommand = new PutCommand({
        TableName: 'vaultnet-users',
        Item: {
            ...userId,
            orgIds: userId.orgIds
        }
    });

    await docClient.send(updateCommand);
}

export const deleteOrgIdFromUser = async (data: any) => {
    const userId = await isUserInOrg(data);

    const org = userId.orgIds.find((item: any) => item.orgId === data.organization.id);

    if (!org) {
        throw new Error("User is not a member of the organization");
    }

    const updateCommand = new PutCommand({
        TableName: 'vaultnet-users',
        Item: {
            ...userId,
            orgIds: userId.orgIds.filter((item: any) => item.orgId !== data.organization.id)
        }
    });

    await docClient.send(updateCommand);

}

export const deleteUser = async (data: any) => {
    const userId = await getUser(data);

    console.log(data.id.toString())

    const command = new DeleteCommand({
        TableName: "vaultnet-users",
        Key: {
          userid: data.id.toString(),
        },
    });

    await docClient.send(command);
}

export const getUser = async (data: any) => {
    const command = new GetCommand({
        TableName: 'vaultnet-users',
        Key: {
            userid: data.id
        }
    });

    const response = await docClient.send(command);

    if (!response.Item) {
        throw new Error("User not found");
    }

    return response.Item;
}

export const getUserById = async (userId: any) => {
    const command = new GetCommand({
        TableName: 'vaultnet-users',
        Key: {
            userid: userId
        }
    });

    const response = await docClient.send(command);

    if (!response.Item) {
        throw new Error("User not found");
    }

    if (!response.Item.mbsUploaded) {
        response.Item.mbsUploaded = 0;
    }

    return response.Item;
}

export const isUserInOrg = async (data: any) => {
    const command = new GetCommand({
        TableName: 'vaultnet-users',
        Key: {
            userid: data.public_user_data.user_id
        }
    });

    const response = await docClient.send(command);

    if (!response.Item) {
        throw new Error("User not found");
    }

    return response.Item;
}

export const updatedMbsUploaded = async (data: any, addToUser: boolean, userId: string) => {
    const { fileSize } = data;
    const currentUser = userId;

    const userData = await getUserById(currentUser);
    const subscriptionSize = await getSubscriptionStorage(userData.subscriptionType);

    console.log("This is the subscription size: ", subscriptionSize.size)

    if (addToUser) {
        const hasEnoughSpace = await hasUserEnoughSpace(userData, fileSize);

        if (!hasEnoughSpace) {
            throw new Error("User does not have enough space");
        }
    }

    let updateCommand;

    if (addToUser) {
        if (userData.mbsUploaded + fileSize > subscriptionSize.size) {
            // Get the overused space
            const overusedSpace = userData.mbsUploaded + fileSize - subscriptionSize.size;
            addToPAYG(userData.customerId, overusedSpace.toString(), userData.userid);
            updateCommand = new PutCommand({
                TableName: 'vaultnet-users',
                Item: {
                    ...userData,
                    mbsUploaded: userData.mbsUploaded + fileSize,
                    PAYGuage: overusedSpace
                }
            });
        } else {
            updateCommand = new PutCommand({
                TableName: 'vaultnet-users',
                Item: {
                    ...userData,
                    mbsUploaded: userData.mbsUploaded + fileSize
                }
            });
        }
    } else {
        let newSize = userData.mbsUploaded - fileSize;
        if (newSize < 0) {
            newSize = 0;
        }
        updateCommand = new PutCommand({
            TableName: 'vaultnet-users',
            Item: {
                ...userData,
                mbsUploaded: newSize
            }
        });
    }

    await docClient.send(updateCommand);
}

const hasUserEnoughSpace = async (userData: any, currentFileSize: number) => {
    const subscriptionSize = await getSubscriptionStorage(userData.subscriptionType);

    console.log("User has uploaded: ", userData.mbsUploaded)
    console.log("Current file size: ", currentFileSize)
    console.log("Subscription size: ", subscriptionSize.size)

    if (userData.payAsYouGo === true) {
        console.log("User has enough space")
        return true;
    } else if (userData.mbsUploaded + currentFileSize < subscriptionSize.size) {
        console.log("User has enough space")
        return true;
    } else {
        console.log("User doesn't has enough space")
        return false;
    }
}

export const getUserId = async () => {
    const user = await currentUser();
  
    if (!user) {
      return '';
    }
  
    return user.id;
}

export const getClerkUser = async () => {
    const user = await currentUser();

    if (!user) {
        throw new Error("User not found");
    }

    return {user};
}

export const getMe = async () => {
    const userId = await getUserId();

    return await getUserById(userId);
}

export const getCurrentSubscription = async () => {
    const userId = await getUserId();

    const user = await getUserById(userId);

    return user.subscriptionType;
}

export const getSubscriptionStorage = async (subscriptionType: string) => {
    const command = new GetCommand({
        TableName: 'vaultnet-subscriptions',
        Key: {
            subscriptionType
        }
    });

    const response = await docClient.send(command);

    if (!response.Item) {
        throw new Error("Subscription not found");
    }

    return response.Item;
}

export const getAllUsers = async () => {
    const command = new ScanCommand({
        TableName: 'vaultnet-users'
    });

    const response = await docClient.send(command);

    return response.Items;
}

export const getExceededStorageUsers = async () => {
    const users = await getAllUsers();

    if (!users) {
        return [];
    }

    let exceededUsers: any[] = [];

    for (const user of users) {
        const subscriptionType = user?.subscriptionType?.S || 'free'; // Extract the string value from the 'AttributeValue' object
        const subscriptionSize = await getSubscriptionStorage(subscriptionType);
        const PAYGperiodEnd = user?.canceledPAYG;
        const periodEnd = user?.canceledSubscription;

        // Skip user if PAYGPeriodEnd or periodEnd is not older than 10 days
        if (PAYGperiodEnd) {
            const now = new Date();
            const paygTime = parseInt(user?.canceledPAYG.N || "0");
            const diff = now.getTime() - (paygTime * 1000);
            const diffDays = diff / ( 1000 * 60 * 60 * 24 );
            console.log("PAYG: This is the time: ", now.getTime())
            console.log("PAYG: This is the PAYGPeriodEnd: ", user?.canceledPAYG.N || 0 * 1000)
            console.log("PAYG: This is the diffTime: ", diff)
            console.log("PAYG: This is the diff: ", diffDays)

            if (diffDays < 10) {
                continue;
            }
        }

        if (periodEnd) {
            const now = new Date();
            const subscriptionEnd = parseInt(user?.canceledSubscription.N || "0");
            const diff = now.getTime() - (subscriptionEnd * 1000);
            const diffDays = diff / ( 1000 * 60 * 60 * 24);
            console.log("This is the username: ", user.name)
            console.log("SUB: This is the sub end: ", subscriptionEnd)
            console.log("SUB: This is the diff: ", diffDays)

            if (diffDays < 10) {
                continue;
            }
        }

        if (!user.mbsUploaded?.N) {
            user.mbsUploaded = { N: "0" };
        }

        if (user.payAsYouGo?.BOOL === true) {
            continue;
        }

        if (user.mbsUploaded?.N > subscriptionSize.size) {
            exceededUsers.push(user);
        }
    }

    console.log("Exceeded users: ", exceededUsers)

    return exceededUsers;
}

export const getAllSubscriptions = async () => {
    const command = new ScanCommand({
        TableName: 'vaultnet-subscriptions'
    });

    const response = await docClient.send(command);

    return response.Items;
}

export const addTagToUser = async (tag: string, color: string) => {
    const userId = await getUserId();

    const user = await getUserById(userId);

    const customTags = user.customTags || [];

    customTags.push({ tag, color });

    const updateCommand = new PutCommand({
        TableName: 'vaultnet-users',
        Item: {
            ...user,
            customTags
        }
    });

    await docClient.send(updateCommand);
}

export const getCustomTags = async () => {
    const userId = await getUserId();

    const user = await getUserById(userId);

    return user.customTags || [];
}

export const deleteTagFromUser = async (tag: string) => {
    const userId = await getUserId();

    const user = await getUserById(userId);

    const customTags = user.customTags || [];

    const updatedTags = customTags.filter((item: any) => item.tag !== tag);

    const updateCommand = new PutCommand({
        TableName: 'vaultnet-users',
        Item: {
            ...user,
            customTags: updatedTags
        }
    });

    await docClient.send(updateCommand);
}

const defaultTags = [
    {tag: "picture", color: "#4ade80"},
    {tag: "video", color: "#60a5fa"},
    {tag: "document", color: "#facc15"},
    {tag: "audio", color: "#f87171"},
    {tag: "other", color: "#c084fc"},
]

export const setInitinalTagsTrue = async () => {
    const userId = await getUserId();

    const user = await getUserById(userId);

    const updateCommand = new PutCommand({
        TableName: 'vaultnet-users',
        Item: {
            ...user,
            customTags: defaultTags,
            setInitinalTagsTrue: true
        }
    });

    await docClient.send(updateCommand);
}

export const setPAYGIdentifier = async (PAYGidentifier: string, userId: string) => {
    const user = await getUserById(userId);

    const updateCommand = new PutCommand({
        TableName: 'vaultnet-users',
        Item: {
            ...user,
            PAYGidentifier,
            payAsYouGo: true
        }
    });

    await docClient.send(updateCommand);
}

export const enablePAYG = async (userId: string, customerId: string, PAYGStart: number, periodEnd: number) => {
    const user = await getUserById(userId);

    if (user.payAsYouGo) {
        return;
    }

    if (user.canceledPAYG) {
        delete user.canceledPAYG;
    }

    const updateCommand = new PutCommand({
        TableName: 'vaultnet-users',
        Item: {
            ...user,
            payAsYouGo: true,
            customerId,
            PAYGStart,
            PAYGperiodEnd: periodEnd
        }
    });

    await docClient.send(updateCommand);
}

export const disablePAYG = async (userId: string) => {
    const user = await getUserById(userId);

    if (!user.payAsYouGo) {
        return;
    }

    delete user.PAYGperiodEnd;

    const updateCommand = new PutCommand({
        TableName: 'vaultnet-users',
        Item: {
            ...user,
            payAsYouGo: false,
        }
    });

    await docClient.send(updateCommand);

    await resetPAYGUsage(userId);
}

export const endPAYG = async (userId: string, PAYGperiodEnd: any) => {
    const user = await getUserById(userId);

    const updateCommand = new PutCommand({
        TableName: 'vaultnet-users',
        Item: {
            ...user,
            canceledPAYG: PAYGperiodEnd,
            PAYGperiodEnd
        }
    });

    await docClient.send(updateCommand);
}

export const resetPAYGUsage = async (userId: string) => {
    const user = await getUserById(userId);

    const updateCommand = new PutCommand({
        TableName: 'vaultnet-users',
        Item: {
            ...user,
            PAYGuage: 0
        }
    });

    await docClient.send(updateCommand);
}

export const calculateOverusedSpace = async (user: any) => {
    const subscription = await getSubscriptionStorage(user.subscriptionType);

    return user.mbsUploaded - subscription.size;
}

export const transferPAYGUsage = async (user: any, overusedSpace: number) => {

    const updateCommand = new PutCommand({
        TableName: 'vaultnet-users',
        Item: {
            ...user,
            PAYGuage: overusedSpace
        }
    });

    await docClient.send(updateCommand);
}