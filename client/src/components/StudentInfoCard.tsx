import { Paper, Title, Text, Box, Stack, Flex } from "@mantine/core"
import React, { useEffect } from "react"
import useAppStore from "../app/Store"

const StudentInfoCard = (props: { type: "wide" | "square" }) => {
    const user = useAppStore(state => state.userInfo)
    const currentSemester = useAppStore(state => state.currentSemester)

    return (
        <Paper h={"100%"} shadow="md" radius="lg" p="lg">
                <Flex gap={"md"} columnGap={150} direction={props.type === "square" ? "column" : "row"} justify={"center"}>
                    <Box>
                        <Title weight={800} size={16}>
                            Name:
                        </Title>
                        <Text size={20}>{user?.name}</Text>
                    </Box>
                    <Box>
                        <Title weight={800} size={16}>
                            Admission Number:
                        </Title>
                        <Text size={20}>{user?.username.toUpperCase()}</Text>
                    </Box>
                    <Box>
                        <Title weight={800} size={16}>
                            Course:
                        </Title>
                        <Text size={20}>
                            {user
                                ? "course" in user!
                                    ? user?.course
                                    : "Something"
                                : "Loading"}
                        </Text>
                    </Box>
                    <Box display={props.type === "wide" ? "" : "none"} >
                        <Title weight={800} size={16}>
                            Semester:
                        </Title>
                        <Text size={20}>
                            {`Year ${user ? "year" in user! && user.year : "Loading"} ${currentSemester === 1 ? "Semester 1" : "Semester 2"}`}
                        </Text>
                    </Box>
                </Flex>
        </Paper>
    )
}

export default StudentInfoCard
