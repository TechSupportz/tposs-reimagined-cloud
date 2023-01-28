import { Burger, Flex, Header, Image, Container, Box } from "@mantine/core"
import TPLogo from "../assets/TP-Logo.png"
import useAppStore from "../Hooks/Store"

const AppBar = () => {
    const isOpen = useAppStore(state => state.isOpen)
    const toggleNavbar = useAppStore(state => state.toggleNavbar)

    return (
        <Header height={{ base: 64, md: 0 }} p={{ base: "md", md: 0 }}>
            <Flex justify="space-between" gap={"md"}>
                <Burger opened={isOpen} onClick={toggleNavbar} size="sm" />
                <Image
                    display={{ md: "none" }}
                    width={125}
                    src={TPLogo}
                    sx={{
                        justifyItems: "center",
                    }}
                />
                <Box w={28}></Box>
            </Flex>
        </Header>
    )
}

export default AppBar
