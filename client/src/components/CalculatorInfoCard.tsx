import { Box, Paper, Stack, Title, Text, Skeleton } from "@mantine/core"
import { baseUrl, fetcher } from "../app/services/api"
import useAppStore from "../app/Store"
import useSWR, { Key, Fetcher } from "swr"
import { SEALPoint, SEALRecord, SEALRecordsAPI } from "../types/SEAL"
import { DateTime } from "luxon"
import { GradePointAverageAPI } from "../types/Results"
import { useEffect, useState } from "react"

const CalculatorInfoCard = () => {
    const tokens = useAppStore(state => state.tokens)
    const user = useAppStore(state => state.userInfo)

    const currentSemester = useAppStore(state => state.currentSemester)

    const newCreditUnits = useAppStore(state => state.newCreditUnits)
    const newGradedCreditUnits = useAppStore(
        state => state.newGradedCreditUnits,
    )

    const subjects = useAppStore(state => state.subjects)
    const [GPA, setGPA] = useState(0)
    const [CGPA, setCGPA] = useState(0)

    const currentYearSemester = `${
        user && "year" in user ? user.year : ""
    }.${currentSemester}`

    const uid: Key = [
        `${baseUrl}/results/gpa/${user?.username}`,
        tokens.id_token,
    ]

    const { data, error, isLoading } = useSWR<GradePointAverageAPI, Error>(
        user && tokens ? uid : null,
        ([url, token]) => fetcher(url, token),
    )

    const semesterUID: Key = [
        `${baseUrl}/results/gpa/${user?.username}/${currentYearSemester}`,
        tokens.id_token,
    ]

    const {
        data: semesterData,
        error: semesterError,
        isLoading: semesterIsLoading,
    } = useSWR<GradePointAverageAPI, Error>(
        user && tokens ? semesterUID : null,
        ([url, token]) => fetcher(url, token),
    )

    useEffect(() => {
        console.log(subjects)
        if (subjects.length !== 0 && data && CGPA !== 0) {
            let gradePoint = 0
            subjects.forEach(subject => {
                gradePoint += parseGrade(subject.grade) * subject.credit_units
            })

            setGPA(gradePoint / newGradedCreditUnits)

            const cGPA =
                (CGPA * data?.totalGradedCredits + gradePoint) /
                (data?.totalGradedCredits + newGradedCreditUnits)

            setCGPA(cGPA)
        }
    }, [subjects])

    useEffect(() => {
        if (data && semesterData) {
            setGPA(semesterData.cgpa)
            setCGPA(data.cgpa)
        }
    }, [data, semesterData])

    const parseGrade = (grade: string) => {
        switch (grade) {
            case "Z":
                return 4
            case "A":
                return 4
            case "B+":
                return 3.5
            case "B":
                return 3
            case "C+":
                return 2.5
            case "C":
                return 2
            case "D+":
                return 1.5
            case "D":
                return 1
            case "P":
                return 1
            case "F":
                return 0
            default:
                return 0
        }
    }

    return (
        <Paper h={"100%"} shadow="md" radius="lg" p="lg">
            <Stack>
                <Box>
                    <Title weight={800} size={16}>
                        Total Credit Units (CU) Earned:
                    </Title>
                    <Text size={20}>
                        {isLoading ? (
                            <Skeleton height={31} width={"15%"} />
                        ) : (
                            `${data?.totalCredits} + ${newCreditUnits}`
                        )}
                    </Text>
                </Box>
                <Box>
                    <Title weight={800} size={16}>
                        Total Graded Credit Units (CU) Earned:
                    </Title>
                    <Text size={20}>
                        {isLoading ? (
                            <Skeleton height={31} width={"15%"} />
                        ) : (
                            `${data?.totalGradedCredits} + ${newGradedCreditUnits}`
                        )}
                    </Text>
                </Box>
                <Box>
                    <Title weight={800} size={16}>
                        Expected Semester Grade Point Average (GPA):
                    </Title>
                    <Text size={20}>
                        {isLoading ? (
                            <Skeleton height={31} width={"15%"} />
                        ) : (
                            GPA.toFixed(2)
                        )}
                    </Text>
                </Box>
                <Box>
                    <Title weight={800} size={16}>
                        Expected Cumulative Grade Point Average (cGPA):
                    </Title>
                    <Text size={20}>
                        {isLoading ? (
                            <Skeleton height={31} width={"15%"} />
                        ) : (
                            CGPA.toFixed(2)
                        )}
                    </Text>
                </Box>
            </Stack>
        </Paper>
    )
}

export default CalculatorInfoCard
