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
		Statement: `SELECT * FROM SEALPoints WHERE (student_id = ? OR members IS NOT MISSING) AND points > 0`,
		Parameters: [studentId],
	})

	try {
		const data = await ddbDocClient.send(executeStatementCommand)
		const filteredData = await filterSEALRecords(data.Items, studentId)
		const totalPoints = await calculateTotalPoints(filteredData)

		// console.log(data.Items.length)
		// console.log(filteredData.length)
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

// Filter out records where the student isn't listed in the members array
const filterSEALRecords = async (data, studentId) => {
	let filteredData = []

	data.forEach((item) => {
		if (item.student_id === studentId || item.members === undefined) {
			filteredData.push(item)
		} else {
			item.members.forEach((member) => {
				if (member.admission_number === studentId) {
					filteredData.push(item)
				}
			})
		}
	})

	return filteredData
}

/* 
cSpell:disable 
This is just for local testing purposes
Ensure this is commented out when deploying to AWS
*/

// console.log("Running locally")
// handler({
// 	pathParameters: {
// 		studentId: "2200000A",
// 	},
// })
