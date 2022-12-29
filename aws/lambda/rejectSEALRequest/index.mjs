import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

const dynamodb = new DynamoDBClient({ region: REGION })
const ddbDocClient = DynamoDBDocumentClient.from(dynamodb)

export const handler = async (event) => {
	const body = JSON.parse(event.body)

	const deleteCommand = new DeleteCommand({
		TableName: "SEALPoints",
		Key: {
			student_id: body.student_id,
			seal_id: body.seal_id,
		},
		ConditionExpression: "points = :zero",
		ExpressionAttributeValues: {
			":zero": 0,
		},
		ReturnValues: "ALL_OLD",
	})

	try {
		const data = await ddbDocClient.send(deleteCommand)

		return {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({
				message: "Rejected SEAL request",
				student_id: data.Attributes.student_id,
				seal_id: data.Attributes.seal_id,
				name: data.Attributes.name,
			}),
		}
	} catch (err) {
		if (err.name === "ConditionalCheckFailedException") {
			return {
				statusCode: 400,
				headers: headers,
				body: JSON.stringify({
					message: "SEAL request has already been approved or request is not found",
				}),
			}
		}

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
// 	body: `{
//   "seal_id": "Ea7lYiuzN5",
//   "student_id": "2201234A"
// }`,
// })
