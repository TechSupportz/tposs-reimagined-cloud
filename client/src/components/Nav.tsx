import { Button, Center, Divider, Image, Navbar, Stack } from "@mantine/core"
import { SymbolCodepoints } from "react-material-symbols/dist/types"
import TPLogo from "../assets/TP-Logo.png"
import NavButton from "./NavButton"

interface NavProps {
    type: "student" | "staff"
}

interface NavItem {
    name: string
    icon: SymbolCodepoints
}

const Nav = (props: NavProps) => {
    const studentNavItems: NavItem[] = [
        {
            name: "Home",
            icon: "home",
        },
        {
            name: "Exam Results & Grades",
            icon: "inventory",
        },
        {
            name: "LOA/MC Summary",
            icon: "event_busy",
        },
        {
            name: "SEAL Points",
            icon: "workspace_premium",
        },
        {
            name: "Semester & Subjects",
            icon: "auto_stories",
        },
        {
            name: "GPA Calculator",
            icon: "calculate",
        },
    ]

    const staffNavItems: NavItem[] = [
        {
            name: "Home",
            icon: "home",
        },
        {
            name: "LOA/MC Summary",
            icon: "event_busy",
        },
        {
            name: "SEAL Points",
            icon: "workspace_premium",
        },
    ]

    return (
        <Navbar p="xs" w={256} withBorder>
            <Navbar.Section>
                <Center p="sm" pb="md">
                    <Image width="85%" src={TPLogo} />
                </Center>
            </Navbar.Section>
            <Navbar.Section grow mt="md">
                <Stack spacing="sm">
                    {props.type === "student"
                        ? studentNavItems.map((item, index) => (
                              <NavButton
                                  key={index}
                                  text={item.name}
                                  icon={item.icon}
                                  onClick={() => console.log(item.name)}
                              />
                          ))
                        : staffNavItems.map((item, index) => (
                              <NavButton
                                  key={index}
                                  text={item.name}
                                  icon={item.icon}
                                  onClick={() => console.log(item.name)}
                              />
                          ))}
                </Stack>
            </Navbar.Section>
            <Navbar.Section py="xs">
                <NavButton
                    text="Logout"
                    icon="logout"
                    onClick={() =>
                        window.location.replace(
                            "https://tposs-reimagined.auth.us-east-1.amazoncognito.com/logout",
                        )
                    }
                />
            </Navbar.Section>
        </Navbar>
    )
}

export default Nav
