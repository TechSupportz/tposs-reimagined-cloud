import { Paper, Title, Text, Box, Stack } from "@mantine/core"
import React, { useEffect } from "react"
import useAppStore from "../app/Store"

const StudentInfoCard = () => {
    const user = useAppStore(state => state.userInfo)

    return (
        <Paper h={"100%"} shadow="md" radius="lg" p="lg">
            <Stack>
                <Box>
                    <Title weight={800} size={16}>
                        Admission Number:
                    </Title>
                    <Text size={20}>{user?.username.toUpperCase()}</Text>
                </Box>
                <Box>
                    <Title weight={800} size={16}>
                        Name:
                    </Title>
                    <Text size={20}>{user?.name}</Text>
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
            </Stack>
        </Paper>
    )
}

export default StudentInfoCard
