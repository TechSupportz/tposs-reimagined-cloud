import { Grid } from "@mantine/core"
import CalculatorInfoCard from "../../components/CalculatorInfoCard"
import CalculatorTableCard from "../../components/CalculatorTableCard"
import StudentInfoCard from "../../components/StudentInfoCard"

const CalculatorStudent = () => {
    return (
        <Grid p="md" h="100%" gutter="xl">
            <Grid.Col sx={{ minHeight: "40%" }} span={4}>
                <StudentInfoCard type="square" displaySemester />
            </Grid.Col>
            <Grid.Col sx={{ minHeight: "40%" }} span={8}>
                <CalculatorInfoCard />
            </Grid.Col>
            <Grid.Col pb={0} sx={{ minHeight: "60%" }}>
                <CalculatorTableCard />
            </Grid.Col>
        </Grid>
    )
}

export default CalculatorStudent
