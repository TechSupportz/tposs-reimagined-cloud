import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { nanoid } from "nanoid"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

const marshallOptions = {
	removeUndefinedValues: true,
}

const dynamodb = new DynamoDBClient({ region: REGION })
const ddbDocClient = DynamoDBDocumentClient.from(dynamodb, { marshallOptions })

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
				approved: false,
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
				approved: false,
			},
		})
	}

	try {
		await ddbDocClient.send(putCommand)
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
//    "student_id":"2101530J",
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
//    "clinic":"The Other Doctor",
//    "approved":false
// }`,
// })
