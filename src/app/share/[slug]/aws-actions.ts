import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const dbClient = new DynamoDBClient({
    region: 'eu-central-1'
});
const docClient = DynamoDBDocumentClient.from(dbClient);

export const setLink = async (id: string, targetLink: string) => {
    const command = new PutCommand({
        TableName: 'vaultnet-links',
        Item: {
            id: id,
            target: targetLink
        }
    });

    const response = await docClient.send(command);
    console.log(response);
};

export const getLink = async (aliasKey: string) => {
    const command = new GetCommand({
        TableName: 'vaultnet-links',
        Key: {
            id: aliasKey
        }
    });
    
    const response = await docClient.send(command);
    console.log(response);
    return response.Item?.target;
}