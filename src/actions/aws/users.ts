'use server';

import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { currentUser } from "@clerk/nextjs";
import { sub } from "date-fns";

const dbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dbClient);

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
        }
    });

    const response = await docClient.send(command);
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

export const updateSubscription = async (userId: any, customerId: string, subscriptionType: string, canceledSub?: boolean) => {
    const user = await getUserById(userId);

    const updateCommand = new PutCommand({
        TableName: 'vaultnet-users',
        Item: {
            ...user,
            subscriptionType,
            customerId,
            canceledSubscription: canceledSub ? new Date().getTime() : "false"
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

    if (addToUser) {
        const hasEnoughSpace = await hasUserEnoughSpace(userData, fileSize);

        if (!hasEnoughSpace) {
            throw new Error("User does not have enough space");
        }
    }

    let updateCommand;

    if (addToUser) {
        updateCommand = new PutCommand({
            TableName: 'vaultnet-users',
            Item: {
                ...userData,
                mbsUploaded: userData.mbsUploaded + fileSize
            }
        });
    } else {
        updateCommand = new PutCommand({
            TableName: 'vaultnet-users',
            Item: {
                ...userData,
                mbsUploaded: userData.mbsUploaded - fileSize
            }
        });
    }

    await docClient.send(updateCommand);
}

const hasUserEnoughSpace = async (userData: any, currentFileSize: number) => {
    const subscriptionSize = await getSubscriptionStorage(userData.subscriptionType);

    if (userData.mbsUploaded + currentFileSize <= subscriptionSize.size) {
        return true;
    } else {
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
        throw new Error("User not found");
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
        const subscriptionType = user?.subscriptionType?.S || ''; // Extract the string value from the 'AttributeValue' object
        const subscriptionSize = await getSubscriptionStorage(subscriptionType);

        if (!user.mbsUploaded?.N) {
            user.mbsUploaded = { N: "0" };
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