import { Center, Image, Navbar, Stack } from "@mantine/core"
import { SymbolCodepoints } from "react-material-symbols/dist/types"
import { useLocation, useNavigate } from "react-router-dom"
import TPLogo from "../assets/TP-Logo.png"
import useAppStore from "../app/Store"
import { UserRole } from "../types/UserRole"
import NavButton from "./NavButton"

interface NavProps {
    type: UserRole
}

interface NavItem {
    name: string
    icon: SymbolCodepoints
    link: string
}

const Nav = (props: NavProps) => {
    const navigate = useNavigate()
    const location = useLocation()

    const studentNavItems: NavItem[] = [
        {
            name: "Home",
            icon: "home",
            link: "/student/home",
        },
        {
            name: "Exam Results & Grades",
            icon: "inventory",
            link: "/student/results",
        },
        {
            name: "LOA/MC Summary",
            icon: "event_busy",
            link: "/student/leave",
        },
        {
            name: "SEAL Points",
            icon: "workspace_premium",
            link: "/student/seal",
        },
        {
            name: "Semester & Subjects",
            icon: "auto_stories",
            link: "/student/subject",
        },
        {
            name: "GPA Calculator",
            icon: "calculate",
            link: "/student/calculator",
        },
    ]

    const staffNavItems: NavItem[] = [
        {
            name: "Home",
            icon: "home",
            link: "/staff/home",
        },
        {
            name: "LOA/MC Summary",
            icon: "event_busy",
            link: "/staff/leave",
        },
        {
            name: "SEAL Points",
            icon: "workspace_premium",
            link: "/staff/seal",
        },
    ]

    const isNavbarOpen = useAppStore(state => state.isNavbarOpen)
    const toggleNavbar = useAppStore(state => state.toggleNavbar)

    return (
        <Navbar
            p="xs"
            hiddenBreakpoint="md"
            width={{ md: 216, lg: 256 }}
            hidden={!isNavbarOpen}>
            <Navbar.Section>
                <Center p={{ base: 0, md: "sm" }} pb={{ base: 0, md: "md" }}>
                    <Image
                        display={{ base: "none", md: "block" }}
                        width="85%"
                        src={TPLogo}
                    />
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
                                  onClick={() => {
                                      navigate(item.link)
                                      setTimeout(() => {
                                          toggleNavbar()
                                      }, 200)
                                  }}
                                  selected={location.pathname === item.link}
                              />
                          ))
                        : staffNavItems.map((item, index) => (
                              <NavButton
                                  key={index}
                                  text={item.name}
                                  icon={item.icon}
                                  onClick={() => {
                                      navigate(item.link)
                                      setTimeout(() => {
                                          toggleNavbar()
                                      }, 200)
                                  }}
                                  selected={location.pathname === item.link}
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
