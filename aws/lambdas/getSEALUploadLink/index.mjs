import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { DateTime } from "luxon"

const REGION = "us-east-1"

export const handler = async (event) => {
	const s3 = new S3Client({ region: REGION })

	try {
		const adminNumber = event.pathParameters.adminNumber
		const putObjectCommand = new PutObjectCommand({
			Bucket: "seal-points-bucket",
			Key: `${adminNumber}-${DateTime.now().toMillis()}.pdf`,
			ContentType: "application/pdf",
		})
		const signedUrl = await getSignedUrl(s3, putObjectCommand, { expiresIn: 3600 })
		console.log(signedUrl)

		return {
			statusCode: 200,
			body: JSON.stringify({
				url: signedUrl,
			}),
		}
	} catch (err) {
		console.log(err)
		return {
			statusCode: 500,
			body: JSON.stringify({
				error: err,
			}),
		}
	}
}

// This is just for local testing purposes
// Ensure this is commented out when deploying to AWS
// console.log("Running locally")
// handler({
// 	pathParameters: {
// 		adminNumber: "2101530J",
// 	},
// })
