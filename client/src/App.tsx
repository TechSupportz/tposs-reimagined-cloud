import axios from "axios"
import React, { useEffect } from "react"

export interface cognitoTokens {
	access_token: string
	expires_in: number
	id_token: string
	refresh_token: string
	token_type: string
}

const App = () => {
	const [authCode, setAuthCode] = React.useState<string | null>(null)
	const [tokens, setTokens] = React.useState<cognitoTokens | null>(null)

	useEffect(() => {
		const url = window.location.href

		setAuthCode(url.split("code=")[1])
	}, [])

	useEffect(() => {
		if (authCode) {
			console.log(authCode)
			fetchTokens(authCode)
		}
	}, [authCode])

	const fetchTokens = async (authCode: string) => {
		try {
			const res = await fetch(
				"https://tposs-reimagined.auth.us-east-1.amazoncognito.com/oauth2/token",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: new URLSearchParams({
						grant_type: "authorization_code",
						code: authCode,
						client_id: "4iermftj0fjo513022qtg0n464",
						redirect_uri: "https://main.d3cvr0pboc0tkg.amplifyapp.com/",
						// redirect_uri: "http://localhost:3000",
					}),
					mode: "cors",
				}
			)
			const data = await res.json()
			console.log(data)
			setTokens(data)
		} catch (err) {
			console.error(err)
		}
	}

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text)
	}

	return (
		<>
			<h1>TPOSS: Reimagined</h1>
			<h2>JWT Tokens</h2>

			<div className="token">
				<h3>ID Token (JWT for authorization)</h3>
				{tokens ? (
					<button onClick={() => copyToClipboard(tokens.id_token)}>Copy</button>
				) : (
					<></>
				)}
				<p>{tokens?.id_token}</p>
			</div>

			<div className="token">
				<h3>Access Token</h3>
				{tokens ? (
					<button onClick={() => copyToClipboard(tokens.access_token)}>Copy</button>
				) : (
					<></>
				)}
				<p>{tokens?.access_token}</p>
			</div>

			<div className="token">
				<h3>Refresh Token</h3>
				{tokens ? (
					<button onClick={() => copyToClipboard(tokens.refresh_token)}>Copy</button>
				) : (
					<></>
				)}
				<p>{tokens?.refresh_token}</p>
			</div>

			<div className="token">
				<h3>Token Type</h3>
				<p>{tokens?.token_type}</p>
			</div>

			<div className="token">
				<h3>Expires In</h3>
				<p>{tokens?.expires_in}</p>
			</div>
		</>
	)
}

export default App
