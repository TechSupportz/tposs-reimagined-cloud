import React from "react"
import useAppStore from "../../app/Store"
import { Box, Paper, Stack, Text, Title } from "@mantine/core"
import { DateTime } from "luxon"

const HomeStaff = () => {
    const user = useAppStore(state => state.userInfo)
    const currentSemester = useAppStore(state => state.currentSemester)

    const getCurrentWeek = () => {
        const now = DateTime.now()
        const start =
            currentSemester === 2
                ? DateTime.local(now.year - 1, 10, 1)
                : DateTime.local(now.year, 4, 1)
        const diff = now.diff(start, ["weeks"])
        return diff.weeks - 2
    }

    return (
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
            </Stack>
        </Paper>
    )
}

export default HomeStaff
