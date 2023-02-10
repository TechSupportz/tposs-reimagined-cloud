import React, { useState } from "react"
import useAppStore from "../../app/Store"
import {
    ActionIcon,
    Box,
    Divider,
    Flex,
    Group,
    Paper,
    SimpleGrid,
    Skeleton,
    Stack,
    Text,
    Title,
} from "@mantine/core"
import { DateTime } from "luxon"
import useSWR, { Key } from "swr"
import { baseUrl, fetcher } from "../../app/services/api"
import { GradePointAverageAPI } from "../../types/Results"
import {
    AutoStories,
    Calculate,
    EventBusy,
    Home,
    Inventory,
    Visibility,
    VisibilityOff,
    WorkspacePremium,
} from "@styled-icons/material-rounded"
import { SEALPoint } from "../../types/SEAL"
import { NavItem } from "../../components/Nav"
import NavButton from "../../components/NavButton"
import { useNavigate } from "react-router-dom"

const HomeStudent = () => {
    const user = useAppStore(state => state.userInfo)
    const tokens = useAppStore(state => state.tokens)

    const currentSemester = useAppStore(state => state.currentSemester)

    const [isGPAHidden, setIsGPAHidden] = useState(true)

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

    const navigate = useNavigate()

    const getCurrentWeek = () => {
        const now = DateTime.now()
        const start =
            currentSemester === 2
                ? DateTime.local(now.year - 1, 10, 1)
                : DateTime.local(now.year, 4, 1)
        const diff = now.diff(start, ["weeks"])
        return diff.weeks - 2
    }

    const uid: Key = [
        `${baseUrl}/results/gpa/${user?.username}`,
        tokens.id_token,
    ]

    const { data, error, isLoading } = useSWR<GradePointAverageAPI, Error>(
        user && tokens ? uid : null,
        ([url, token]) => fetcher(url, token),
    )

    const SEALuid: Key = [
        `${baseUrl}/SEAL/points/${user?.username}`,
        tokens.id_token,
    ]

    const {
        data: SEALdata,
        error: SEALerror,
        isLoading: SEALisLoading,
    } = useSWR<SEALPoint, Error>(
        user && tokens ? SEALuid : null,
        ([url, token]) => fetcher(url, token),
    )

    return (
        <Stack spacing={"xl"}>
            <Paper shadow="md" radius="lg" p="lg">
                <Stack>
                    <Box>
                        <Title size={35}>Welcome back</Title>
                        <Text size={30}>{user?.name}</Text>
                    </Box>
                    <Box>
                        <Title>It is currently</Title>
                        <Text size={30}>
                            Semester {currentSemester} Week{" "}
                            {getCurrentWeek().toFixed()}
                        </Text>
                    </Box>
                    <Divider />
                    <Box>
                        <Title size={"h2"}>cGPA</Title>
                        <Flex
                            w={"13%"}
                            align="center"
                            justify={"space-between"}>
                            <Text size={24}>
                                {isLoading || isGPAHidden ? (
                                    <Skeleton
                                        visible={isLoading || isGPAHidden}
                                        animate={isLoading}
                                        height={37}
                                        width={"10ch"}
                                    />
                                ) : (
                                    data?.cgpa.toFixed(2)
                                )}
                            </Text>
                            <ActionIcon
                                onClick={() => setIsGPAHidden(!isGPAHidden)}>
                                {isGPAHidden ? (
                                    <Visibility />
                                ) : (
                                    <VisibilityOff />
                                )}
                            </ActionIcon>
                        </Flex>
                    </Box>
                    <Box>
                        <Title size={"h2"}>SEAL Points</Title>

                        <Text size={24}>
                            {SEALisLoading ? (
                                <Skeleton height={37} width={"10ch"} />
                            ) : (
                                SEALdata?.points
                            )}
                        </Text>
                    </Box>
                </Stack>
            </Paper>
            <Paper shadow="md" radius="lg" p="lg">
                <Title mb={"lg"}>Services</Title>
                <SimpleGrid cols={3} spacing="sm">
                    {studentNavItems.map((item, index) => (
                        <NavButton
                            key={index}
                            text={item.name}
                            icon={item.icon}
                            onClick={() => {
                                navigate(item.link)
                            }}
                        />
                    ))}
                </SimpleGrid>
            </Paper>
        </Stack>
    )
}

export default HomeStudent
