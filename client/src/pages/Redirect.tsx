import { Center, Loader, Stack, Title } from "@mantine/core"
import { useEffect } from "react"

interface RedirectProps {
	url: string
}

const Redirect = ({url}: RedirectProps) => {
    useEffect(() => {
        window.location.replace(url)
    }, [url])

    return (
        <Center style={{ width: "100%", height: "100%" }}>
            <Stack justify="center" align="center">
                <Loader size="xl" variant="bars" />
                <Title size="h2">Redirecting...</Title>
            </Stack>
        </Center>
    )
}

export default Redirect
