import { Center, Container, Loader, Stack, Text, Title } from "@mantine/core"
import React from "react"

const Authenticate = () => {
	



    return (
        <Center style={{ width: "100%", height: "100%"}}>
            <Stack justify="center" align="center">
				<Loader size="xl" variant="bars" />
				<Title size="h2">Verifying your credentials</Title>
			</Stack>
        </Center>
    )
}

export default Authenticate
