import {
	CognitoIdentityProvider,
	ListUsersInGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

const cognito = new CognitoIdentityProvider({ region: REGION })

export const handler = async (event) => {
	const staffId = event.pathParameters.staffId
	console.log("staffId: ", staffId)

	const listUsersCommand = new ListUsersInGroupCommand({
		UserPoolId: "us-east-1_NLmQO3pWZ",
		GroupName: "Student",
	})

	try {
		const data = await cognito.send(listUsersCommand)
		const filteredStudents = await filterStudentsByCarePerson(data.Users, staffId)
		console.log("filteredStudents: ", filteredStudents)

		return {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({
				message: "Students retrieved successfully",
				students: filteredStudents,
			}),
		}
	} catch (err) {
		console.log("err: ", err)
		return {
			statusCode: 500,
			headers: headers,
			body: JSON.stringify({
				message: "Error retrieving students",
			}),
		}
	}
}

const filterStudentsByCarePerson = async (students, staffId) => {
	const filteredStudents = students.filter((student) => {
		return student.Attributes.find((attribute) => {
			return attribute.Name === "custom:care_person_id" && attribute.Value === staffId
		})
	})

	return filteredStudents
}

/* 
cSpell:disable 
This is just for local testing purposes
Ensure this is commented out when deploying to AWS
*/

// console.log("Running locally")
// handler({
// 	pathParameters: {
// 		staffId: "FT12345A",
// 	},
// })
