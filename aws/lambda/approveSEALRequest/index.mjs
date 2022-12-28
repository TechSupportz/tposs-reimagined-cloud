import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

const dynamodb = new DynamoDBClient({ region: REGION })
const ddbDocClient = DynamoDBDocumentClient.from(dynamodb)

export const handler = async (event) => {
	const body = JSON.parse(event.body)

	const updateCommand = new UpdateCommand({
		TableName: "SEALPoints",
		Key: {
			student_id: body.student_id,
			seal_id: body.seal_id,
		},
		ConditionExpression: `points = :zero`,
		UpdateExpression: `SET points = :points`,
		ExpressionAttributeValues: {
			":points": body.points,
			":zero": 0,
		},
		ReturnValues: "ALL_NEW",
	})

	try {
		const data = await ddbDocClient.send(updateCommand)
		return {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({
				message: "Successfully approved SEAL request",
				student_id: data.Attributes.student_id,
				seal_id: data.Attributes.seal_id,
				points: data.Attributes.points,
			}),
		}
	} catch (err) {
		if (err.name === "ConditionalCheckFailedException") {
            console.log("balls")
			return {
				statusCode: 400,
				headers: headers,
				body: JSON.stringify({
					message: "SEAL request has already been approved and points have been awarded or request is not found",
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

// This is just for local testing purposes
// Ensure this is commented out when deploying to AWS

// console.log("Running locally")
// handler({
// 	body: `{
//   "seal_id": "hw8m8kaKwc",
//   "student_id": "2101530P",
//   "points": 500
// }`,
// })
