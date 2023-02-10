import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2"
import { nanoid } from "nanoid"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

const marshallOptions = {
	removeUndefinedValues: true,
}

const dynamodb = new DynamoDBClient({ region: REGION })
const ddbDocClient = DynamoDBDocumentClient.from(dynamodb, { marshallOptions })

const ses = new SESv2Client({ region: REGION })

export const handler = async (event) => {
	const body = JSON.parse(event.body)

	let putCommand

	if (body.type == "LOA") {
		putCommand = new PutCommand({
			TableName: "Leave",
			Item: {
				student_id: body.student_id,
				staff_id: body.staff_id,
				leave_id: nanoid(10),
				type: body.type,
				reason: body.reason,
				duration: body.duration,
				additional_information: body.additional_information,
				attachment: body.attachment,
				contact_number: body.contact_number,
				graded_assignment: body.graded_assignment,
				assignment_information: body.assignment_information ?? undefined,
				status: "Pending",
			},
		})
	} else if (body.type == "MC") {
		putCommand = new PutCommand({
			TableName: "Leave",
			Item: {
				student_id: body.student_id,
				staff_id: body.staff_id,
				leave_id: nanoid(10),
				type: body.type,
				reason: body.reason,
				duration: body.duration,
				additional_information: body.additional_information,
				attachment: body.attachment,
				contact_number: body.contact_number,
				mc_number: body.mc_number,
				clinic: body.clinic,
				status: "Pending",
			},
		})
	}

	try {
		await ddbDocClient.send(putCommand)
		await sendEmailNotification(
			putCommand.input.Item.student_id,
			putCommand.input.Item.reason,
			putCommand.input.Item.type,
			putCommand.input.Item.duration
		)
		return {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({
				message: `Successfully created new ${putCommand.input.Item.type} request`,
				student_id: putCommand.input.Item.student_id,
				leave_id: putCommand.input.Item.leave_id,
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

const sendEmailNotification = async (studentId, reason, type, duration) => {
	const sendEmailCommand = new SendEmailCommand({
		FromEmailAddress: "2101530J+TPOSS-Reimagined@student.tp.edu.sg",
		Destination: {
			ToAddresses: ["2101530J+TPOSS-Reimagined@student.tp.edu.sg"],
		},
		Content: {
			Simple: {
				Subject: {
					Data: `${studentId} - ${type} Request sent successfully`,
				},
				Body: {
					Text: {
						Data: `Your ${type} request for ${reason} from ${duration[0]} to ${duration[1]} has been submitted successfully`,
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

/* 
cSpell:disable 
This is just for local testing purposes
Ensure this is commented out when deploying to AWS
*/

// LOA
// console.log("Running locally")
// handler({
// 	body: `{
//  "student_id": "2101234B",
//   "staff_id": "FT12345A",
//  "additional_information": "Competition for Fun",
//  "attachment": "TotallyLegitS3Key",
//  "contact_number": "+6591234568",
//  "duration": [
//   "2022-11-26",
//   "2022-11-27"
//  ],
//  "graded_assignment": false,
//  "reason": "Competititon",
//  "type": "LOA"
// 	}`,
// })

// MC
// console.log("Running locally")
// handler({
// 	body: `{
//    "student_id":"2101530B",
//    "staff_id":"FT12345A",
//    "type":"MC",
//    "reason":"Sick",
//    "duration":[
//       "2022-11-26",
//       "2022-11-27"
//    ],
//    "additional_information":"Sick with illness",
//    "attachment":"S3Key",
//    "contact_number":"+6591234568",
//    "mc_number":"2874790",
//    "clinic":"The Other Doctor"
// }`,
// })
