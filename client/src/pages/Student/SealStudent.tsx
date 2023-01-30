import { Grid, Paper } from "@mantine/core"
import React from "react"

const SealStudent = () => {
    return (
        <Grid p="md" h="100%" gutter="xl">
            <Grid.Col sx={{ minHeight: "35%" }} span={4}>
                <Paper h="100%" shadow="md" radius="lg">
                    1
                </Paper>
            </Grid.Col>
            <Grid.Col sx={{ minHeight: "30%" }} span={8}>
                <Paper h="100%" shadow="md" radius="lg">
                    2
                </Paper>
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
