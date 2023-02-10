import { Grid } from '@mantine/core'
import React from 'react'
import ResultsInfoCard from '../../components/ResultsInfoCard'
import ResultsTableCard from '../../components/ResultsTableCard'
import SEALTableCard from '../../components/SEALTableCard'
import StudentInfoCard from '../../components/StudentInfoCard'

const ResultsStudent = () => {
  return (
      <Grid p="md" h="100%" gutter="xl">
          <Grid.Col sx={{ minHeight: "30%" }} span={4}>
              <StudentInfoCard type="square" />
          </Grid.Col>
          <Grid.Col sx={{ minHeight: "30%" }} span={8}>
              <ResultsInfoCard />
          </Grid.Col>
          <Grid.Col pb={0} sx={{ minHeight: "70%" }}>
              <ResultsTableCard />
          </Grid.Col>
      </Grid>
  )
}

export default ResultsStudent