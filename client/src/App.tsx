import {
    AppShell,
    Center,
    Header,
    Navbar,
    Text,
    Title,
    Stack,
    Button,
} from "@mantine/core"

import React from "react"

const App = () => {
    return (
        <Center h="100vh">
            <Stack align="center">
                <Title>Title - Raleway</Title>
                <Text>Hello - Lato</Text>
                <Button>Button!</Button>
            </Stack>
        </Center>
    )
}

export default App
