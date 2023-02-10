import { Center, Container, Loader, Stack, Text, Title } from "@mantine/core"
import { useSessionStorage } from "@mantine/hooks"
import jwtDecode from "jwt-decode"
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthTokens, StaffInfo, StudentInfo } from "../app/Slices/AuthSlice"
import useAppStore from "../app/Store"

const Authenticate = () => {
    const [authCode, setAuthCode] = React.useState<string | null>(null)
    const [isAuthenticated, setIsAuthenticated] = React.useState(false)
    const tokens = useAppStore(state => state.tokens)
    const user = useAppStore(state => state.userInfo)
    const setUser = useAppStore(state => state.setUser)

    const navigate = useNavigate()

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

    useEffect(() => {
        if (isAuthenticated) {
            if (user?.role === "staff") {
                navigate("/staff/home")
            } else if (user?.role === "student") {
                navigate("/student/home")
            }
        }
    }, [isAuthenticated])

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
                        redirect_uri:
                            "https://main.d3cvr0pboc0tkg.amplifyapp.com/",
                    }),
                    // mode: "cors",
                },
            )
            const data = (await res.json()) as AuthTokens
            console.log(data)
            await updateUser(data)
            setIsAuthenticated(true)
        } catch (err) {
            console.error(err)
        }
    }

    const updateUser = async (tokens: AuthTokens) => {
        const decodedToken: any = jwtDecode(tokens.id_token!)
        const role = decodedToken["cognito:groups"][0].toLowerCase()

        if (role === "staff") {
            const user: StaffInfo = {
                name: decodedToken.name as string,
                username: decodedToken["cognito:username"] as string,
                role: "staff",
                school: decodedToken["custom:school"] as string,
                phoneNumber: decodedToken.phone_number as string,
            }
            console.log(user)
            setUser(tokens, user)
        } else if (role === "student") {
            const user: StudentInfo = {
                name: decodedToken.name as string,
                username: decodedToken["cognito:username"] as string,
                role: "student",
                school: decodedToken["custom:school"] as string,
                course: decodedToken["custom:course"] as string,
                year: decodedToken["custom:year"] as number,
                carePersonId: decodedToken["custom:care_person_id"] as string,
                phoneNumber: decodedToken.phone_number as string,
            }
            console.log(user)
            setUser(tokens, user)
        }
    }

    return (
        <Center style={{ width: "100%", height: "100%" }}>
            <Stack justify="center" align="center">
                <Loader size="xl" variant="bars" />
                {isAuthenticated ? (
                    <Title size="h2">Welcome!</Title>
                ) : (
                    <Title size="h2">Verifying your credentials</Title>
                )}
            </Stack>
        </Center>
    )
}

export default Authenticate
