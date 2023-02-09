import { Paper, Title, Text, Box, Stack, Flex, Skeleton } from "@mantine/core"
import React, { useEffect } from "react"
import useSWR, { Key } from "swr"
import { baseUrl, fetcher } from "../app/services/api"
import useAppStore from "../app/Store"

interface UserInfo {
    username: string
    name: string
    email: string
    phone_number: string
    course: string
    year: number
}

const StudentInfoCard = (props: {
    type: "wide" | "square"
    username?: string
    isDataLoading?: boolean
}) => {
    const user = useAppStore(state => state.userInfo)
    const tokens = useAppStore(state => state.tokens)
    const currentSemester = useAppStore(state => state.currentSemester)

    const uid: Key = [`${baseUrl}/user/${props.username}`, tokens.id_token]

    const { data, error, isLoading } = useSWR<UserInfo, Error>(
        props.username ? uid : null,
        ([url, token]) => fetcher(url, token),
    )

    return (
        <Paper h={"100%"} shadow="md" radius="lg" p="lg">
            <Skeleton visible={isLoading || props.isDataLoading === true}>
                <Flex
                    gap={"md"}
                    columnGap={150}
                    direction={props.type === "square" ? "column" : "row"}
                    justify={"center"}>
                    <Box>
                        <Title weight={800} size={16}>
                            Name:
                        </Title>
                        <Text size={20}>
                            {props.username ? data?.name : user?.name}
                        </Text>
                    </Box>
                    <Box>
                        <Title weight={800} size={16}>
                            Admission Number:
                        </Title>
                        <Text size={20}>
                            {props.username
                                ? data?.username.toUpperCase()
                                : user?.username.toUpperCase()}
                        </Text>
                    </Box>
                    <Box>
                        <Title weight={800} size={16}>
                            Course:
                        </Title>
                        <Text size={20}>
                            {props.username
                                ? data?.course
                                : user
                                ? "course" in user!
                                    ? user?.course
                                    : "Something"
                                : "Loading"}
                        </Text>
                    </Box>
                    <Box display={props.type === "wide" ? "" : "none"}>
                        <Title weight={800} size={16}>
                            Semester:
                        </Title>
                        <Text size={20}>
                            {`Year ${
                                props.username
                                    ? data?.year
                                    : user
                                    ? "year" in user! && user.year
                                    : "Loading"
                            } ${
                                currentSemester === 1
                                    ? "Semester 1"
                                    : "Semester 2"
                            }`}
                        </Text>
                    </Box>
                </Flex>
            </Skeleton>
        </Paper>
    )
}

export default StudentInfoCard
