import { Box, Paper, Select, Stack, Tabs, Title } from "@mantine/core"
import { ContentPaste } from "@styled-icons/material-rounded"
import { DataTable } from "mantine-datatable"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useSWR, { Key } from "swr"
import { baseUrl, fetcher } from "../app/services/api"
import { CalculatorSubjects } from "../app/Slices/CalculatorSlice"
import useAppStore from "../app/Store"
import { theme, useStyles } from "../Theme"
import {
    GradePointAverageAPI,
    ResultsAPI,
    SemesterType,
} from "../types/Results"
import { SEALType } from "../types/SEAL"
import { SubjectBySemesterAPI } from "../types/Subjects"

const ResultsTableCard = () => {
    const navigate = useNavigate()

    const tokens = useAppStore(state => state.tokens)
    const user = useAppStore(state => state.userInfo)

    const currentSemester = useAppStore(state => state.currentSemester)

    const setNewCreditUnits = useAppStore(state => state.setNewCreditUnits)
    const setNewGradedCreditUnits = useAppStore(
        state => state.setNewGradedCreditUnits,
    )

    const subjects = useAppStore(state => state.subjects)
    const setSubjects = useAppStore(state => state.setSubjects)
    const updateSubjects = useAppStore(state => state.updateSubjects)

    const currentYearSemester = `${
        user && "year" in user ? user.year : ""
    }.${currentSemester}`

    const { classes } = useStyles()

    const uid: Key = [
        `${baseUrl}/subjects/${
            user ? "course" in user && user.course : null
        }/20${user?.username.slice(0, 2)}/${currentYearSemester}`,
        tokens.id_token,
    ]

    const { data, error, isLoading } = useSWR<SubjectBySemesterAPI, Error>(
        currentYearSemester ? uid : null,
        ([url, token]) => fetcher(url, token),
    )

    useEffect(() => {
        if (data) {
            const subjectsWithGrade: CalculatorSubjects[] = data?.items.subjects
                .filter(record => record.graded)
                .map(subject => ({
                    subject_code: subject.subject_code,
                    subject_name: subject.subject_name,
                    credit_units: subject.credit_units,
                    graded: subject.graded,
                    grade: "A",
                }))

            const creditUnits = data?.items.subjects
                .map(subject => subject.credit_units)
                .reduce((a, b) => {
                    return a + b
                })

            const gradedCreditUnits = data?.items.subjects
                .filter(record => record.graded)
                .map(subject => subject.credit_units)
                .reduce((a, b) => {
                    return a + b
                })

            setSubjects(subjectsWithGrade)
            setNewCreditUnits(creditUnits)
            setNewGradedCreditUnits(gradedCreditUnits)
        }
    }, [data])

    const onGradeChange = (value: string, subject: any) => {
        const newSubject = {
            subject_code: subject["Subject Code"],
            subject_name: subject["Subject Name"],
            credit_units: subject["Credit Units"],
            graded: true,
            grade: value,
        }

        const subjectsNew: CalculatorSubjects[] = JSON.parse(
            JSON.stringify(subjects),
        )

        const index = subjectsNew.findIndex(
            s => s.subject_code === newSubject.subject_code,
        )

        subjectsNew[index] = newSubject

        updateSubjects(subjectsNew)
    }

    return (
        <Paper shadow="md" h="100%" radius="lg" p="lg">
            <Title mb={"md"}>Current Semester</Title>
            <Box h={"86%"}>
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
                    textSelectionDisabled
                    emptyState={
                        data ? (
                            <Stack align="center" spacing="xs">
                                <ContentPaste size={40} color="#f58a9b" />
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
                        {
                            accessor: "Grade",
                            cellsStyle: { padding: 0, margin: 0 },
                            render: item => (
                                <Select
                                    radius={0}
                                    p={0}
                                    styles={theme => ({
                                        input: {
                                            backgroundColor: "transparent",
                                            border: "none",
                                        },
                                    })}
                                    size="sm"
                                    defaultValue={"A"}
                                    onClick={() => {
                                        // console.log(item)
                                    }}
                                    onChange={value => {
                                        onGradeChange(value!, item)
                                    }}
                                    data={[
                                        { label: "A", value: "A" },
                                        { label: "B+", value: "B+" },
                                        { label: "B", value: "B" },
                                        { label: "C+", value: "C+" },
                                        { label: "C", value: "C" },
                                        { label: "D+", value: "D+" },
                                        { label: "D", value: "D" },
                                        { label: "F", value: "F" },
                                    ]}></Select>
                            ),
                        },
                    ]}
                    records={
                        subjects
                            ? subjects
                                  .filter(record => record.graded)
                                  .map(record => ({
                                      "Subject Code": record.subject_code,
                                      "Subject Name": record.subject_name,
                                      "Credit Units": record.credit_units,
                                      Key: record.subject_code,
                                  }))
                            : []
                    }
                />
            </Box>
        </Paper>
    )
}

export default ResultsTableCard
