import { Box, Paper, Stack, Title, Text, Skeleton } from "@mantine/core"
import { baseUrl, fetcher } from "../app/services/api"
import useAppStore from "../app/Store"
import useSWR, { Key, Fetcher } from "swr"
import { SEALPoint } from "../types/SEAL"

const SEALInfoCard = () => {
    const tokens = useAppStore(state => state.tokens)
    const user = useAppStore(state => state.userInfo)

    const uid: Key = [
        `${baseUrl}/SEAL/points/${user?.username}`,
        tokens.id_token,
    ]

    const { data, error, isLoading } = useSWR<SEALPoint, Error>(
        uid,
        ([url, token]) => fetcher(url, token),
    )

    return (
        <Paper h={"100%"} shadow="md" radius="lg" p="lg">
            <Stack>
                <Box>
                    <Title weight={800} size={16}>
                        Total SEAL Points Earned:
                    </Title>
                    <Text size={20}>
                        {isLoading ? (
                            <Skeleton height={31} width={"15%"} />
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
                        Most recent event:
                    </Title>
                    <Text size={20}>Nothing!</Text>
                </Box>
            </Stack>
        </Paper>
    )
}

export default SEALInfoCard
