import {
    Box,
    Button,
    Center,
    createStyles,
    Divider,
    Flex,
    Loader,
    Overlay,
    Paper,
    Stack,
    Table,
    Tabs,
    Text,
    Title,
} from "@mantine/core"
import { ContentPaste } from "@styled-icons/material-rounded"
import { DataTable } from "mantine-datatable"
import React, { useEffect } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import useSWR, { Key } from "swr"
import { baseUrl, fetcher } from "../app/services/api"
import useAppStore from "../app/Store"
import { SEALRecordAPI, SEALType } from "../types/SEAL"

const useStyles = createStyles(theme => ({
    table: {
        border: `3px solid ${theme.colors.brand[4]}`,
        backgroundColor: "hsl(0, 100%, 97%)",
    },
}))

const SEALTableCard = () => {
    const navigate = useNavigate()

    const tokens = useAppStore(state => state.tokens)    
    const user = useAppStore(state => state.userInfo)    
    
    const selectedType = useAppStore(state => state.selectedType)    
    const setSelectedType = useAppStore(state => state.setSelectedType)    
    
    const { classes } = useStyles()

    const uid: Key = [
        `${baseUrl}/SEAL/${user?.username}/${selectedType}`,
        tokens.id_token,
    ]

    const { data, error, isLoading } = useSWR<SEALRecordAPI, Error>(
        selectedType ? uid : null,
        ([url, token]) => fetcher(url, token),
    )

    return (
        <Paper shadow="md" h="100%" radius="lg" p="lg">
            <Stack h="100%" align="stretch" justify="center">
                <Tabs
                    variant="pills"
                    allowTabDeactivation
                    value={selectedType}
                    onTabChange={value => setSelectedType(value as SEALType)}>
                    <Tabs.List grow>
                        <Tabs.Tab value="Service">Service</Tabs.Tab>
                        <Tabs.Tab value="Enrichment">Enrichment</Tabs.Tab>
                        <Tabs.Tab value="Achievement">Achievement</Tabs.Tab>
                        <Tabs.Tab value="Leadership">Leadership</Tabs.Tab>
                    </Tabs.List>
                </Tabs>
                <Box pos="relative" h={"100%"} bg="white">
                    <Box h={"100%"} bg="white" opacity={selectedType ? 1 : 0.6}>
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
                            emptyState={
                                data?.items.length === 0 ? (
                                    <Stack align="center" spacing="xs">
                                        <ContentPaste
                                            size={40}
                                            color="#f58a9b"
                                        />
                                        <Title color="brand.2" size="h4">
                                            No records found
                                        </Title>
                                    </Stack>
                                ) : (
                                    <></>
                                )
                            }
                            columns={[
                                { accessor: "Academic Year", width: "15%" },
                                { accessor: "Activity", width: "40%" },
                                { accessor: "Involvement" },
                                { accessor: "Points Awarded" },
                            ]}
                            records={data?.items.map(record => ({
                                "Academic Year":
                                    record.duration[1].split("-")[0],
                                Activity: record.name,
                                Involvement: record.involvement,
                                "Points Awarded": record.points,
                            }))}
                        />
                    </Box>
                    <Stack
                        opacity={selectedType ? 0 : 1}
                        pos="absolute"
                        top="50%"
                        left="50%"
                        sx={{
                            transform: "translateY(-50%) translateX(-50%)",
                        }}
                        align="center"
                        spacing="xs">
                        <Title color="black" size="sm">
                            Select a category to view your points
                        </Title>
                        <Divider
                            w={"100%"}
                            size="sm"
                            labelPosition="center"
                            color="brand.2"
                            label={
                                <Title size="1.5em" color="black">
                                    or
                                </Title>
                            }
                        />
                        <Button
                            size="md"
                            radius="xl"
                            onClick={() => navigate("new")}>
                            Submit a SEAL Point Request
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Paper>
    )
}

export default SEALTableCard
