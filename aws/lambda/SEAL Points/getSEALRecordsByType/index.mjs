import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ExecuteStatementCommand } from "@aws-sdk/lib-dynamodb"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

const dynamodb = new DynamoDBClient({ region: REGION })
const ddbDocClient = DynamoDBDocumentClient.from(dynamodb)

export const handler = async (event) => {
	const { studentId, type } = event.pathParameters

	console.log("studentId: " + studentId)
	console.log("type: " + type)

	if (
		type !== "Service" &&
		type !== "Enrichment" &&
		type !== "Achievement" &&
		type !== "Leadership"
	) {
		return {
			statusCode: 400,
			headers: headers,
			body: JSON.stringify({
				message: "Invalid SEAL type provided",
			}),
		}
	}

	const executeStatementCommand = new ExecuteStatementCommand({
		Statement: `SELECT * FROM SEALPoints WHERE (student_id = ? OR members IS NOT MISSING) AND type = ? AND points > 0`,
		Parameters: [studentId, type],
	})

	try {
		const data = await ddbDocClient.send(executeStatementCommand)
		const filteredData = await filterSEALRecords(data.Items, studentId)

		console.log(data.Items)
		console.log(filteredData)

		return {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({
				message: "Successfully retrieved SEAL records",
				items: filteredData,
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
// 		type: "Achievement",
// 	},
// })
