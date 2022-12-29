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
		Statement: `SELECT * FROM SEALPoints WHERE student_id = ? AND points > 0`,
		Parameters: [studentId],
	})

	try {
		const data = await ddbDocClient.send(executeStatementCommand)
		const totalPoints = await calculateTotalPoints(data.Items)

		// console.log(data)
		// console.log(totalPoints)

		return {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({
				message: "Successfully retrieved total SEAL points",
				student_id: studentId,
				points: totalPoints,
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

const calculateTotalPoints = async (data) => {
	let totalPoints = 0

	if (data.length === 0) {
		return totalPoints
	}

	data.forEach((item) => {
		totalPoints += item.points
	})

	return totalPoints
}

/* 
cSpell:disable 
This is just for local testing purposes
Ensure this is commented out when deploying to AWS
*/

// console.log("Running locally")
// handler({
// 	pathParameters: {
// 		studentId: "2201234A",
// 	},
// })
