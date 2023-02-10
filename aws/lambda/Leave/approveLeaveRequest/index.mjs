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
		TableName: "Leave",
		Key: {
			student_id: body.student_id,
			leave_id: body.leave_id,
		},
		ConditionExpression: `#status = :currentState`,
		UpdateExpression: `SET #status = :newState`,
		ExpressionAttributeNames: {
			"#status": "status",
		},
		ExpressionAttributeValues: {
			":currentState": "Pending",
			":newState": "Approved",
		},
		ReturnValues: "ALL_NEW",
	})

	try {
		const data = await ddbDocClient.send(updateCommand)
		await sendEmailNotification(
			data.Attributes.student_id,
			data.Attributes.reason,
			data.Attributes.type,
			data.Attributes.duration
		)

		return {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({
				message: `Approved ${data.Attributes.type} request`,
				student_id: data.Attributes.student_id,
				leave_id: data.Attributes.leave_id,
				duration: data.Attributes.duration,
			}),
		}
	} catch (err) {
		if (err.name === "ConditionalCheckFailedException") {
			return {
				statusCode: 400,
				headers: headers,
				body: JSON.stringify({
					message: "Leave request has already been approved or request is not found",
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

const sendEmailNotification = async (studentId, reason, type, duration) => {
	const sendEmailCommand = new SendEmailCommand({
		FromEmailAddress: "2101530J+TPOSS-Reimagined@student.tp.edu.sg",
		Destination: {
			ToAddresses: ["2101530J+TPOSS-Reimagined@student.tp.edu.sg"],
		},
		Content: {
			Simple: {
				Subject: {
					Data: `${studentId} - ${type} Request Approved`,
				},
				Body: {
					Text: {
						Data: `Your ${type} request for ${reason} from ${duration[0]} to ${duration[1]} has been approved.`,
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
//     "student_id": "2101530B",
//     "leave_id": "Y_bavW0gYz"
// }`,
// })
