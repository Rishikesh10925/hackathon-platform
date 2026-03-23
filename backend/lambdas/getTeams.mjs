import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    // CORS headers to allow React frontend to fetch the data
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET"
    };

    try {
        // NOTE: Replace 'Teams' with your exact DynamoDB table name for Teams
        const command = new ScanCommand({
            TableName: "Teams"
        });

        const response = await docClient.send(command);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                teams: response.Items
            })
        };
    } catch (error) {
        console.error("Error fetching teams:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Could not retrieve teams", details: error.message })
        };
    }
};
