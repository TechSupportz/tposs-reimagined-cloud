import { Box, Paper, Stack, Title, Text, Skeleton } from "@mantine/core"
import { baseUrl, fetcher } from "../app/services/api"
import useAppStore from "../app/Store"
import useSWR, { Key, Fetcher } from "swr"
import { SEALPoint, SEALRecord, SEALRecordsAPI } from "../types/SEAL"
import { DateTime } from "luxon"
import { GradePointAverageAPI } from "../types/Results"

const ResultsInfoCard = () => {
    const tokens = useAppStore(state => state.tokens)
    const user = useAppStore(state => state.userInfo)

    const selectedSemester = useAppStore(state => state.selectedSemester)

    const uid: Key = [
        `${baseUrl}/results/gpa/${user?.username}`,
        tokens.id_token,
    ]

    const { data, error, isLoading } = useSWR<GradePointAverageAPI, Error>(
        user && tokens ? uid : null,
        ([url, token]) => fetcher(url, token),
    )

    const selectedUID: Key = [
        `${baseUrl}/results/gpa/${user?.username}/${selectedSemester}`,
        tokens.id_token,
    ]

    const {
        data: selectedData,
        error: selectedError,
        isLoading: selectedIsLoading,
    } = useSWR<GradePointAverageAPI, Error>(
        selectedSemester ? selectedUID : null,
        ([url, token]) => fetcher(url, token),
    )

    return (
        <Paper h={"100%"} shadow="md" radius="lg" p="lg">
            <Stack>
                <Box>
                    <Title weight={800} size={16}>
                        {selectedSemester
                            ? `Total Credit Units (CU) of Semester ${selectedSemester}`
                            : `Total Credit Units (CU) Earned:`}
                    </Title>
                    <Text size={20}>
                        {isLoading || selectedIsLoading ? (
                            <Skeleton height={31} width={"15%"} />
                        ) : selectedSemester ? (
                            selectedData?.totalCredits
                        ) : (
                            data?.totalCredits
                        )}
                    </Text>
                </Box>
                <Box>
                    <Title weight={800} size={16}>
                        {selectedSemester
                            ? `Total Graded Credit Units (CU) of Semester ${selectedSemester}`
                            : `Total Graded Credit Units (CU) Earned:`}
                    </Title>
                    <Text size={20}>
                        {isLoading || selectedIsLoading ? (
                            <Skeleton height={31} width={"15%"} />
                        ) : selectedSemester ? (
                            selectedData?.totalGradedCredits
                        ) : (
                            data?.totalGradedCredits
                        )}
                    </Text>
                </Box>
                <Box>
                    <Title weight={800} size={16}>
                        {selectedSemester
                            ? `Grade Point Average (GPA) of ${selectedSemester}`
                            : `Cumulative Grade Point Average (cGPA):`}
                    </Title>
                    <Text size={20}>
                        {isLoading || selectedIsLoading ? (
                            <Skeleton height={31} width={"15%"} />
                        ) : selectedSemester && selectedData ? (
                            selectedData?.cgpa?.toFixed(2)
                        ) : (
                            data?.cgpa.toFixed(2)
                        )}
                    </Text>
                </Box>
            </Stack>
        </Paper>
    )
}

export default ResultsInfoCard
