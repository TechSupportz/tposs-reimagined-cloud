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
import Nav from "./components/Nav"

const App = () => {
    return (
        <AppShell navbar={<Nav type="student" />}>
            <Center h="100%">
                <Stack align="center">
                    <Title>Title - Raleway</Title>
                    <Text>Hello - Lato</Text>
                    <Button>Button!</Button>
                </Stack>
            </Center>
        </AppShell>
    )
}

export default App
