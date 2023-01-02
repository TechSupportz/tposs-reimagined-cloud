import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ExecuteStatementCommand } from "@aws-sdk/lib-dynamodb"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

const dynamodb = new DynamoDBClient({ region: REGION })
const ddbDocClient = DynamoDBDocumentClient.from(dynamodb)

export const handler = async (event) => {
	const course = event.pathParameters.course
	const cohort = event.pathParameters.cohort
	const semester = event.pathParameters.semester

	console.log("course: " + course)

	const executeStatementCommand = new ExecuteStatementCommand({
		Statement: `SELECT * FROM Subjects WHERE course = ?`,
		Parameters: [course],
	})

	try {
		const data = await ddbDocClient.send(executeStatementCommand)

		if (data.Items.length === 0) {
			return {
				statusCode: 404,
				headers: headers,
				body: JSON.stringify({
					message: "No Subjects found for this course",
					course: course,
				}),
			}
		}

		if (cohort) {
			const filteredData = filterSubjectsByCohort(data.Items, cohort)

			if (filteredData.length === 0) {
				return {
					statusCode: 404,
					headers: headers,
					body: JSON.stringify({
						message: "No Subjects found for this course and cohort combination",
						course: course,
					}),
				}
			}

			if (semester) {
				const filteredBySemester = filteredData.filter((subject) => {
					const subjectSemester = subject.cohort.split("S")
					return subjectSemester[1] === semester
				})

				if (filteredBySemester.length === 0) {
					return {
						statusCode: 404,
						headers: headers,
						body: JSON.stringify({
							message:
								"No Subjects found for this course, cohort and semester combination",
							course: course,
						}),
					}
				}

				console.log(filteredBySemester)
				return {
					statusCode: 200,
					headers: headers,
					body: JSON.stringify({
						message: `Successfully retrieved semester ${semester} subjects for ${cohort} cohort`,
						subjects: filteredBySemester,
					}),
				}
			}

			return {
				statusCode: 200,
				headers: headers,
				body: JSON.stringify({
					message: `Successfully retrieved subjects for ${cohort} cohort`,
					subjects: filteredData,
				}),
			}
		}

		console.log(data.Items)
		return {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({
				message: "Successfully retrieved subjects",
				subjects: data.Items,
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

const filterSubjectsByCohort = (subjects, cohort) => {
	const filteredByYear = subjects.filter((subject) => {
		const cohortYear = subject.cohort.split("S")
		return cohortYear[0] === cohort
	})

	if (filteredByYear.length === 0) {
		let recentYear = 0

		subjects.forEach((subject) => {
			const cohortYear = subject.cohort.split("S")
			if (
				parseInt(cohortYear[0]) > recentYear &&
				parseInt(cohortYear[0]) < parseInt(cohort)
			) {
				recentYear = parseInt(cohortYear[0])
			}
		})

		const filteredByRecentYear = subjects.filter((subject) => {
			const cohortYear = subject.cohort.split("S")
			return cohortYear[0] === recentYear.toString()
		})

		return filteredByRecentYear
	}

	return filteredByYear
}

/* 
cSpell:disable 
This is just for local testing purposes
Ensure this is commented out when deploying to AWS
*/

// console.log("Running locally")
// handler({
// 	pathParameters: {
// 		course: "Information Technology",
// 		cohort: "2023",
// 	},
// })
