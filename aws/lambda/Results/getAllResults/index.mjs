import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ExecuteStatementCommand } from "@aws-sdk/lib-dynamodb"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

const dynamodb = new DynamoDBClient({ region: REGION })
const ddbDocClient = DynamoDBDocumentClient.from(dynamodb)

export const handler = async (event) => {
	const studentId = event.pathParameters.studentId

	console.log("studentId: " + studentId)

	const executeStatementCommand = new ExecuteStatementCommand({
		Statement: `SELECT * FROM Results WHERE student_id = ?`,
		Parameters: [studentId],
	})

	try {
		const data = await ddbDocClient.send(executeStatementCommand)
		// console.log(data.Items)
		return {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({
				message: "Successfully retrieved Results",
				items: data.Items,
			}),
		}
	} catch (err) {
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
// 		studentId: "2101530J",
// 	},
// })
