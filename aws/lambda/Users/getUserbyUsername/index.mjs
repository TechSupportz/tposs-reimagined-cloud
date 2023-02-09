import {
	CognitoIdentityProvider,
	ListUsersInGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

const cognito = new CognitoIdentityProvider({ region: REGION })

export const handler = async (event) => {
    const username = event.pathParameters.username.toUpperCase()
    console.log("username: ", username)

    const isStaff = await checkIfStaff(username)

    const listUsersCommand = new ListUsersInGroupCommand({
		UserPoolId: "us-east-1_NLmQO3pWZ",
        GroupName: isStaff ? "Staff" : "Student",
	})

	try {
		const data = await cognito.send(listUsersCommand)

        const users = data.Users

        const user = users.find((user) => user.Username.toUpperCase() === username)

        if (user) {
            return {
				statusCode: 200,
				headers: headers,
				body: JSON.stringify({
					username: user.Username,
					name: user.Attributes.find((attribute) => attribute.Name === "name").Value,
					email: user.Attributes.find((attribute) => attribute.Name === "email").Value,
					phone_number: user.Attributes.find(
						(attribute) => attribute.Name === "phone_number"
					).Value,
					year: !isStaff
						? user.Attributes.find((attribute) => attribute.Name === "custom:year")
								.Value
						: -1,
					course: !isStaff
						? user.Attributes.find((attribute) => attribute.Name === "custom:course")
								.Value
						: user.Attributes.find((attribute) => attribute.Name === "custom:school")
								.Value,
				}),
			}
        } else {
            return {
                statusCode: 404,
                headers: headers,
                body: JSON.stringify({
                    message: "User not found",
                }),
            }
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

const checkIfStaff = async (username) => {
    if (username[0] === "F" || username[0] === "T") {
        return true
    } else {
        return false
    }
}

// console.log("Running locally")
// handler({
// 	pathParameters: {
// 		username: "2101530J",
// 	},
// }).then((res) => console.log(res.body))