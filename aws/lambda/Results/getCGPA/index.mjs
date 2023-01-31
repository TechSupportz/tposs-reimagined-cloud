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
		Statement: `SELECT * FROM Results WHERE student_id = ?`,
		Parameters: [studentId],
	})

	try {
		const data = await ddbDocClient.send(executeStatementCommand)
		const cgpa = await calculateCGPA(data.Items)
		// console.log(cgpa)

		return {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({
				message: "Successfully retrieved cgpa",
				cgpa: cgpa.cgpa,
				totalCredits: cgpa.totalCredits,
				totalGradedCredits: cgpa.totalGradedCredits,
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

const calculateCGPA = async (allResults) => {
	let gradePoint = 0
	let totalGradedCredits = 0
	let totalCredits = 0

	for (const semester of allResults) {
		semester.results.forEach((subject) => {
			totalCredits += subject.credit_units
			if (subject.grade === "PASS" || subject.grade === "FAIL") return
			gradePoint += parseGrade(subject.grade) * subject.credit_units
			totalGradedCredits += subject.credit_units
		})
	}

	return {
		cgpa: gradePoint / totalGradedCredits,
		totalCredits: totalCredits,
		totalGradedCredits: totalGradedCredits,
	}
}

const parseGrade = (grade) => {
	switch (grade) {
		case "Z":
			return 4
		case "A":
			return 4
		case "B+":
			return 3.5
		case "B":
			return 3
		case "C+":
			return 2.5
		case "C":
			return 2
		case "D+":
			return 1.5
		case "D":
			return 1
		case "P":
			return 1
		case "F":
			return 0
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
// 		studentId: "2101234A",
// 	},
// })
