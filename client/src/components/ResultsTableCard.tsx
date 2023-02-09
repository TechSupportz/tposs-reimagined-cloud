import { Box, Paper, Stack, Tabs, Title } from "@mantine/core"
import { ContentPaste } from "@styled-icons/material-rounded"
import { DataTable } from "mantine-datatable"
import { useNavigate } from "react-router-dom"
import useSWR, { Key } from "swr"
import { baseUrl, fetcher } from "../app/services/api"
import useAppStore from "../app/Store"
import { useStyles } from "../Theme"
import {
    GradePointAverageAPI,
    ResultsAPI,
    SemesterType,
} from "../types/Results"
import { SEALType } from "../types/SEAL"

const ResultsTableCard = () => {
    const navigate = useNavigate()

    const tokens = useAppStore(state => state.tokens)
    const user = useAppStore(state => state.userInfo)

    const selectedSemester = useAppStore(state => state.selectedSemester)
    const setSelectedSemester = useAppStore(state => state.setSelectedSemester)

    const { classes } = useStyles()

    const uid: Key = [
        `${baseUrl}/results/${user?.username}/${selectedSemester}`,
        tokens.id_token,
    ]

    const { data, error, isLoading } = useSWR<ResultsAPI, Error>(
        selectedSemester ? uid : null,
        ([url, token]) => fetcher(url, token),
    )

    return (
        <Paper shadow="md" h="100%" radius="lg" p="lg">
            <Stack h="100%" align="stretch" justify="center">
                <Tabs
                    variant="pills"
                    allowTabDeactivation
                    value={selectedSemester}
                    onTabChange={value =>
                        setSelectedSemester(value as SemesterType)
                    }>
                    <Tabs.List grow>
                        <Tabs.Tab value="1.1">Y1 Semester 1</Tabs.Tab>
                        <Tabs.Tab value="1.2">Y1 Semester 2</Tabs.Tab>
                        <Tabs.Tab value="2.1">Y2 Semester 1</Tabs.Tab>
                        <Tabs.Tab value="2.2">Y2 Semester 2</Tabs.Tab>
                        <Tabs.Tab value="3.1">Y3 Semester 1</Tabs.Tab>
                        <Tabs.Tab value="3.2">Y3 Semester 2</Tabs.Tab>
                    </Tabs.List>
                </Tabs>
                <Box pos="relative" h={"100%"} bg="white">
                    <Box
                        h={"100%"}
                        bg="white"
                        opacity={selectedSemester ? 1 : 0.6}>
                        <DataTable
                            className={classes.table}
                            withBorder
                            withColumnBorders
                            highlightOnHover
                            borderRadius="md"
                            rowBorderColor={theme => theme.colors.brand[1]}
                            rowStyle={{ backgroundColor: "hsl(0, 100%, 97%)" }}
                            fetching={isLoading}
                            loaderVariant="dots"
                            onRowClick={row => {
                                navigate(`${row.Key}`)
                            }}
                            textSelectionDisabled
                            emptyState={
                                data?.message ===
                                "No Results found for this studentId and semester" ? (
                                    <Stack align="center" spacing="xs">
                                        <ContentPaste
                                            size={40}
                                            color="#f58a9b"
                                        />
                                        <Title color="brand.2" size="h4">
                                            Results have not been released yet
                                        </Title>
                                    </Stack>
                                ) : (
                                    <></>
                                )
                            }
                            columns={[
                                { accessor: "Subject Code", width: "15%" },
                                { accessor: "Subject Name", width: "60%" },
                                { accessor: "Credit Units", width: "10%" },
                                { accessor: "Grade" },
                            ]}
                            records={
                                data?.message !==
                                "No Results found for this studentId and semester"
                                    ? data?.items.results.map(record => ({
                                          "Subject Code": record.subject_code,
                                          "Subject Name": record.subject_name,
                                          "Credit Units": record.credit_units,
                                          Grade: record.grade,
                                          Key: record.subject_code,
                                      }))
                                    : []
                            }
                        />
                    </Box>
                    <Stack
                        opacity={selectedSemester ? 0 : 1}
                        pos="absolute"
                        top="50%"
                        left="50%"
                        sx={{
                            transform: "translateY(-50%) translateX(-50%)",
                        }}
                        align="center"
                        spacing="xs">
                        <Title color="black" size="h1">
                            Select a semester to view your results
                        </Title>
                    </Stack>
                </Box>
            </Stack>
        </Paper>
    )
}

export default ResultsTableCard
