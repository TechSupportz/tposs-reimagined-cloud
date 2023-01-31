import { Grid, Paper } from "@mantine/core"
import React from "react"
import SEALInfoCard from "../../components/SEALInfoCard"
import StudentInfoCard from "../../components/StudentInfoCard"

const SealStudent = () => {
    return (
        <Grid p="md" h="100%" gutter="xl">
            <Grid.Col sx={{ minHeight: "35%" }} span={4}>
                <StudentInfoCard />
            </Grid.Col>
            <Grid.Col sx={{ minHeight: "30%" }} span={8}>
                <SEALInfoCard />
            </Grid.Col>
            <Grid.Col pb={0} sx={{ minHeight: "65%" }}>
                <Paper shadow="md" h="100%" radius="lg">
                    3
                </Paper>
            </Grid.Col>
        </Grid>
    )
}

export default SealStudent
