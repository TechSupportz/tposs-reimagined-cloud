import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ExecuteStatementCommand } from "@aws-sdk/lib-dynamodb"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

const dynamodb = new DynamoDBClient({ region: REGION })
const ddbDocClient = DynamoDBDocumentClient.from(dynamodb)

export const handler = async (event) => {
	const studentId = event.pathParameters.studentId
	const semester = parseSemester(event.pathParameters.semester)

	if (typeof semester !== "number") {
		return semester
	}

	console.log("studentId: " + studentId)
	console.log("semester: " + semester)

	const executeStatementCommand = new ExecuteStatementCommand({
		Statement: `SELECT * FROM Results WHERE student_id = ? AND semester = ?`,
		Parameters: [studentId, semester],
	})

	try {
		const data = await ddbDocClient.send(executeStatementCommand)

		if (data.Items.length === 0) {
			return {
				statusCode: 404,
				headers: headers,
				body: JSON.stringify({
					message: "No Results found for this studentId and semester",
					studentId: studentId,
					semester: semester,
				}),
			}
		}

		return {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({
				message: "Successfully retrieved Results",
				items: data.Items,
			}),
		}
	} catch (err) {
		return {
			statusCode: 500,
			headers: headers,
			body: JSON.stringify({
				message: err,
			}),
		}
	}
}

export const parseSemester = (semester) => {
	try {
		const semesterFloat = parseFloat(semester)

		const semesterSplit = semester.split(".")

		if (semesterSplit.length !== 2 || (semesterSplit[1] !== "1" && semesterSplit[1] !== "2")) {
			return {
				statusCode: 400,
				headers: headers,
				body: JSON.stringify({
					message:
						"Invalid semester format. Please use the following format: <year>.<semester> where <semester> is either 1 or 2",
					semester: semester,
				}),
			}
		}

		return semesterFloat
	} catch (err) {
		return {
			statusCode: 400,
			headers: headers,
			body: JSON.stringify({
				message:
					"Invalid semester format. Please use the following format: <year>.<semester> where <semester> is either 1 or 2",
				semester: semester,
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
// 	pathParameters: {
// 		studentId: "2101530J",
// 		semester: "1.1",
// 	},
// })
