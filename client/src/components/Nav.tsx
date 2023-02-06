import { Center, Image, Navbar, Stack } from "@mantine/core"
import { useLocation, useNavigate } from "react-router-dom"
import TPLogo from "../assets/TP-Logo.png"
import useAppStore from "../app/Store"
import { UserRole } from "../types/UserRole"
import NavButton from "./NavButton"
import Redirect from "../pages/Redirect"
import { StyledIcon } from "@styled-icons/styled-icon"
import {
    AutoStories,
    Calculate,
    EventBusy,
    Home,
    Inventory,
    Logout,
    WorkspacePremium,
} from "@styled-icons/material-rounded"

interface NavProps {
    type: UserRole
}

interface NavItem {
    name: string
    icon: JSX.Element
    link: string
}

const Nav = (props: NavProps) => {
    const navigate = useNavigate()
    const location = useLocation()

    const studentNavItems: NavItem[] = [
        {
            name: "Home",
            icon: <Home size={28} color="#ef5c6e" />,
            link: "/student/home",
        },
        {
            name: "Exam Results & Grades",
            icon: <Inventory size={28} color="#ef5c6e" />,
            link: "/student/results",
        },
        {
            name: "LOA/MC Summary",
            icon: <EventBusy size={28} color="#ef5c6e" />,
            link: "/student/leave",
        },
        {
            name: "SEAL Points",
            icon: <WorkspacePremium size={28} color="#ef5c6e" />,
            link: "/student/seal",
        },
        {
            name: "Semester & Subjects",
            icon: <AutoStories size={28} color="#ef5c6e" />,
            link: "/student/subject",
        },
        {
            name: "GPA Calculator",
            icon: <Calculate size={28} color="#ef5c6e" />,
            link: "/student/calculator",
        },
    ]

    const staffNavItems: NavItem[] = [
        {
            name: "Home",
            icon: <Home size={28} color="#ef5c6e" />,
            link: "/staff/home",
        },
        {
            name: "LOA/MC Summary",
            icon: <EventBusy size={28} color="#ef5c6e" />,
            link: "/staff/leave",
        },
        {
            name: "SEAL Points",
            icon: <WorkspacePremium size={28} color="#ef5c6e" />,
            link: "/staff/seal",
        },
    ]

    const isNavbarOpen = useAppStore(state => state.isNavbarOpen)
    const toggleNavbar = useAppStore(state => state.toggleNavbar)

    const clearUser = useAppStore(state => state.clearUser)

    const logoutUser = async () => {
        navigate("/logout")
        clearUser()
    }

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
                    icon={<Logout size={28} color="#ef5c6e" />}
                    onClick={logoutUser}
                />
            </Navbar.Section>
        </Navbar>
    )
}

export default Nav
