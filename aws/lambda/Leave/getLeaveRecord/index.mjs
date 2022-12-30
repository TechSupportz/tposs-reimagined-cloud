import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ExecuteStatementCommand } from "@aws-sdk/lib-dynamodb"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

const dynamodb = new DynamoDBClient({ region: REGION })
const ddbDocClient = DynamoDBDocumentClient.from(dynamodb)

export const handler = async (event) => {
	const leaveId = event.pathParameters.leaveId

	console.log("leaveId: " + leaveId)

	const executeStatementCommand = new ExecuteStatementCommand({
		Statement: `SELECT * FROM Leave WHERE leave_id = ?`,
		Parameters: [leaveId],
	})

	try {
		const data = await ddbDocClient.send(executeStatementCommand)
		// console.log(data.Items)

		if (!data.Items || data.Items.length === 0) {
			return {
				statusCode: 404,
				headers: headers,
				body: JSON.stringify({
					message: "Leave record not found",
				}),
			}
		}

		return {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({
				message: `Successfully retrieved ${data.Items[0].type} record`,
				record: data.Items[0],
			}),
		}
	} catch {
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
// 		leaveId: "HndeI39",
// 	},
// })
