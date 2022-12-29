import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { nanoid } from "nanoid"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

const dynamodb = new DynamoDBClient({ region: REGION })
const ddbDocClient = DynamoDBDocumentClient.from(dynamodb)

export const handler = async (event) => {
	const body = JSON.parse(event.body)

	const putCommand = new PutCommand({
		TableName: "SEALPoints",
		Item: {
			student_id: body.student_id,
			staff_id: body.staff_id,
			seal_id: nanoid(10),
			name: body.name,
			type: body.type,
			duration: body.duration,
			involvement: body.involvement,
			award_details: body.award_details,
			members: body.members,
			attachment_key: body.attachment_key,
			points: 0,
		},
	})

	try {
		await ddbDocClient.send(putCommand)
		return {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({
				message: "Successfully created new SEAL request",
				student_id: putCommand.input.Item.student_id,
				seal_id: putCommand.input.Item.seal_id,
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

// This is just for local testing purposes
// Ensure this is commented out when deploying to AWS

console.log("Running locally")
handler({
	body: `{
		"student_id": "2101530J",
		"staff_id": "FT12345A",
		"attachment_key": "AnotherTotallyLegitS3Key",
		"award_details": "Second Prize, $100 capitaland vouchers per member",
		"duration": ["2022-12-10", "2022-12-12"],
		"involvement": "Participant",
		"members": [
			{
				"admission_number": "2200000A",
				"name": "Mike Ross"
			}
		],
		"name": "Hack - The Hackathon",
		"type": "Achievement"
	}`,
})
