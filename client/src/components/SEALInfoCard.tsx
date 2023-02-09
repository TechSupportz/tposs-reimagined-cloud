import { Box, Paper, Stack, Title, Text, Skeleton } from "@mantine/core"
import { baseUrl, fetcher } from "../app/services/api"
import useAppStore from "../app/Store"
import useSWR, { Key, Fetcher } from "swr"
import { SEALPoint, SEALRecord, SEALRecordsAPI } from "../types/SEAL"
import { DateTime } from "luxon"

const SEALInfoCard = () => {
    const tokens = useAppStore(state => state.tokens)
    const user = useAppStore(state => state.userInfo)

    const selectedType = useAppStore(state => state.selectedType)

    const uid: Key = [
        `${baseUrl}/SEAL/points/${user?.username}`,
        tokens.id_token,
    ]

    const { data, error, isLoading } = useSWR<SEALPoint, Error>(
        user && tokens ? uid : null,
        ([url, token]) => fetcher(url, token),
    )

    const selectedUID: Key = [
        `${baseUrl}/SEAL/${user?.username}/${selectedType}`,
        tokens.id_token,
    ]

    const {
        data: selectedData,
        error: selectedError,
        isLoading: selectedIsLoading,
    } = useSWR<SEALRecordsAPI, Error>(
        selectedType ? selectedUID : null,
        ([url, token]) => fetcher(url, token),
    )

    const getRecentEvent = (events: SEALRecord[]) => {
        if (events.length === 0) {
            return "No events recorded"
        }

        const sortedEvents = events.sort((a, b) => {
            const aDate = DateTime.fromISO(a.duration[1])
            const bDate = DateTime.fromISO(b.duration[1])

            return aDate.diff(bDate).milliseconds
        })

        return sortedEvents[0].name
    }

    return (
        <Paper h={"100%"} shadow="md" radius="lg" p="lg">
            <Stack>
                <Box>
                    <Title weight={800} size={16}>
                       {`Total ${selectedType ? selectedType : "SEAL"} Points Earned:`}
                    </Title>
                    <Text size={20}>
                        {isLoading || selectedIsLoading ? (
                            <Skeleton height={31} width={"15%"} />
                        ) : selectedType ? (
                            selectedData?.totalPoints
                        ) : (
                            data?.points
                        )}
                    </Text>
                </Box>
                <Box>
                    <Title weight={800} size={16}>
                        CCA Grade:
                    </Title>
                    <Text size={20}>
                        {isLoading ? (
                            <Skeleton height={31} width={"15%"} />
                        ) : (
                            data?.grade
                        )}
                    </Text>
                </Box>
                <Box>
                    <Title weight={800} size={16}>
                        {selectedType
                            ? `Most recent ${selectedType} event:`
                            : "Most recent event:"}
                    </Title>
                    <Text size={20}>
                        {isLoading || selectedIsLoading ? (
                            <Skeleton height={31} width={"15%"} />
                        ) : (
                            selectedType ?
                            getRecentEvent(selectedData?.items!) : "Select a category to view"
                        )}
                    </Text>
                </Box>
            </Stack>
        </Paper>
    )
}

export default SEALInfoCard
