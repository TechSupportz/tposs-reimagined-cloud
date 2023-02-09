import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { DateTime } from "luxon"

const REGION = "us-east-1"
const headers = { "Content-Type": "application/json" }

export const handler = async (event) => {
	const s3 = new S3Client({ region: REGION })
	const { type, key } = event.pathParameters

	if (type !== "leave" && type !== "seal")
		return {
			statusCode: 400,
			headers: headers,
			body: JSON.stringify({
				message: "Invalid type provided. Please enter leave or seal.",
			}),
		}

	try {
		const getObjectCommand = new GetObjectCommand({
			Bucket: type === "leave" ? "leave-bucket" : "seal-points-bucket",
			Key: key,
			ContentType: "application/pdf",
		})
		const signedUrl = await getSignedUrl(s3, getObjectCommand, { expiresIn: 3600 })
		console.log(signedUrl)

		return {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({
				url: signedUrl,
				key: getObjectCommand.input.Key,
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
// 		type: "leave",
// 		key: "2101530J-1672407870569.pdf",
// 	},
// })
