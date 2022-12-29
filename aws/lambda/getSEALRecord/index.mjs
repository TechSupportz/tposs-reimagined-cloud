import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ExecuteStatementCommand } from "@aws-sdk/lib-dynamodb"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

const dynamodb = new DynamoDBClient({ region: REGION })
const ddbDocClient = DynamoDBDocumentClient.from(dynamodb)

export const handler = async (event) => {
	const sealId = event.pathParameters.sealId

	const executeStatementCommand = new ExecuteStatementCommand({
		Statement: `SELECT * FROM SEALPoints WHERE seal_id = ?`,
		Parameters: [sealId],
	})

	try {
		const data = await ddbDocClient.send(executeStatementCommand)
		if (!data.Items || data.Items.length === 0) {
			return {
				statusCode: 404,
				headers: headers,
				body: JSON.stringify({
					message: "SEAL record not found",
				}),
			}
		}

		return {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({
				message: "Successfully retrieved SEAL record",
				record: data.Items[0],
			}),
		}
	} catch (err) {
		console.log(err)
		return {
			statusCode: 500,
			headers: headers,
			body: JSON.stringify({
				message: err,
			}),
		}
	}
}

/* 
cSpell:disable 
This is just for local testing purposes
Ensure this is commented out when deploying to AWS
*/

// console.log("Running locally")
// handler({
// 	pathParameters: {
// 		sealId: "BgRqxIEe6P",
// 	},
// })
