import { Grid } from "@mantine/core"
import React from "react"
import ResultsInfoCard from "../../components/ResultsInfoCard"
import ResultsTableCard from "../../components/ResultsTableCard"
import StudentInfoCard from "../../components/StudentInfoCard"
import SubjectsTableCard from "../../components/SubjectsTableCard"

const SubjectStudent = () => {
    return (
        <Grid p="md" h="100%" gutter="xl">
            <Grid.Col sx={{ minHeight: "10%" }}>
                <StudentInfoCard type="wide" />
            </Grid.Col>
            <Grid.Col sx={{ minHeight: "90%" }}>
                <SubjectsTableCard />
            </Grid.Col>
        </Grid>
    )
}

export default SubjectStudent
