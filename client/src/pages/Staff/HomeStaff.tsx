import React from "react"
import useAppStore from "../../app/Store"
import {
    Box,
    Divider,
    Paper,
    SimpleGrid,
    Skeleton,
    Stack,
    Text,
    Title,
} from "@mantine/core"
import { DateTime } from "luxon"
import NavButton from "../../components/NavButton"
import { NavItem } from "../../components/Nav"
import {
    Home,
    EventBusy,
    WorkspacePremium,
} from "@styled-icons/material-rounded"
import { useNavigate } from "react-router-dom"
import useSWR ,{ Key } from "swr"
import { SEALRequestsAPI } from "../../types/SEAL"
import { baseUrl, fetcher } from "../../app/services/api"
import { LOARecordsAPI, MCRecordsAPI } from "../../types/Leave"

const HomeStaff = () => {
    const user = useAppStore(state => state.userInfo)
    const tokens = useAppStore(state => state.tokens)
    const currentSemester = useAppStore(state => state.currentSemester)

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

    const sealUID: Key = [
        `${baseUrl}/SEAL/requests/${user?.username}`,
        tokens.id_token,
    ]

    const { data: sealData , error :sealError, isLoading: sealIsLoading } = useSWR<SEALRequestsAPI, Error>(
        user ? sealUID : null,
        ([url, token]) => fetcher(url, token),
    )

    const loaUID: Key = [
        `${baseUrl}/leave/requests/${user?.username}/LOA`,
        tokens.id_token,
    ]

    const mcUID: Key = [
        `${baseUrl}/leave/requests/${user?.username}/MC`,
        tokens.id_token,
    ]

    const {
        data: loaData,
        error: loaError,
        isLoading: loaIsLoading,
    } = useSWR<LOARecordsAPI, Error>(user ? loaUID : null, ([url, token]) =>
        fetcher(url, token),
    )

    const {
        data: mcData,
        error: mcError,
        isLoading: mcIsLoading,
    } = useSWR<MCRecordsAPI, Error>(user ? mcUID : null, ([url, token]) =>
        fetcher(url, token),
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
                        <Title size={"h2"}>Pending SEAL Requests</Title>
                        <Text size={24}>
                            {sealIsLoading ? (
                                <Skeleton height={37} width={"10ch"} />
                            ) : (
                                sealData?.items.length
                            )}
                        </Text>
                    </Box>
                    <Box>
                        <Title size={"h2"}>Pending LOA Requests</Title>
                        <Text size={24}>
                            {loaIsLoading ? (
                                <Skeleton height={37} width={"10ch"} />
                            ) : (
                                loaData?.items.length
                            )}
                        </Text>
                    </Box>
                    <Box>
                        <Title size={"h2"}>Pending MC Requests</Title>
                        <Text size={24}>
                            {mcIsLoading ? (
                                <Skeleton height={37} width={"10ch"} />
                            ) : (
                                mcData?.items.length
                            )}
                        </Text>
                    </Box>
                </Stack>
            </Paper>
            <Paper shadow="md" radius="lg" p="lg">
                <Title mb={"lg"}>Services</Title>
                <SimpleGrid cols={3} spacing="sm">
                    {staffNavItems.map((item, index) => (
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

export default HomeStaff
