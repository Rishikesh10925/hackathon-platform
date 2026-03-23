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
        // NOTE: Replace 'Judges' with your exact DynamoDB table name for Judges
        const command = new ScanCommand({
            TableName: "Judges"
        });

        const response = await docClient.send(command);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                judges: response.Items
            })
        };
    } catch (error) {
        console.error("Error fetching judges:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Could not retrieve judges", details: error.message })
        };
    }
};
