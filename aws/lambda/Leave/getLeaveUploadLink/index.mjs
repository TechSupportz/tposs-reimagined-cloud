import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { DateTime } from "luxon"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

export const handler = async (event) => {
	const s3 = new S3Client({ region: REGION })

	try {
		const studentId = event.pathParameters.studentId
		const putObjectCommand = new PutObjectCommand({
			Bucket: "leave-bucket",
			Key: `${studentId}-${DateTime.now().toMillis()}.pdf`,
			ContentType: "application/pdf",
		})
		const signedUrl = await getSignedUrl(s3, putObjectCommand, { expiresIn: 3600 })
		console.log(signedUrl)

		return {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({
				url: signedUrl,
				key: putObjectCommand.input.Key,
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
// console.log("Running locally")
// handler({
// 	pathParameters: {
// 		studentId: "2101530J",
// 	},
// })
