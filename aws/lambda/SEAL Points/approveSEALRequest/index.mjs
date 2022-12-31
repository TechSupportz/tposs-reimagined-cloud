import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

const dynamodb = new DynamoDBClient({ region: REGION })
const ddbDocClient = DynamoDBDocumentClient.from(dynamodb)

const ses = new SESv2Client({ region: REGION })

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
		await sendEmailNotification(
			data.Attributes.student_id,
			data.Attributes.name,
			data.Attributes.type,
			data.Attributes.points
		)

		return {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({
				message: "Approved SEAL request",
				student_id: data.Attributes.student_id,
				seal_id: data.Attributes.seal_id,
				name: data.Attributes.name,
				points: data.Attributes.points,
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

const sendEmailNotification = async (studentId, name, type, points) => {
	const sendEmailCommand = new SendEmailCommand({
		FromEmailAddress: "2101530J+TPOSS-Reimagined@student.tp.edu.sg",
		Destination: {
			ToAddresses: ["2101530J+TPOSS-Reimagined@student.tp.edu.sg"],
		},
		Content: {
			Simple: {
				Subject: {
					Data: `${studentId} - SEAL Point Request Approved`,
				},
				Body: {
					Text: {
						Data: `You have been awarded ${points} ${type} points for ${name}.`,
					},
				},
			},
		},
	})

	try {
		const data = await ses.send(sendEmailCommand)
		console.log("Email sent successfully. Message ID: ", data.MessageId)
	} catch (err) {
		console.log(err)
	}
}

// This is just for local testing purposes
// Ensure this is commented out when deploying to AWS

// console.log("Running locally")
// handler({
// 	body: `{
//   "seal_id": "7khcHpZUyn",
//   "student_id": "2201234A",
//   "points": 50
// }`,
// })
