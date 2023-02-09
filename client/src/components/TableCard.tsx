import { Box, Button, Paper, Stack, Title } from "@mantine/core"
import { ContentPaste } from "@styled-icons/material-rounded"
import { DataTable } from "mantine-datatable"
import { DataTableColumn } from "mantine-datatable/dist/types"
import React from "react"
import { useNavigate } from "react-router-dom"
import { useStyles } from "../Theme"

interface LeaveTableCardProps {
    title: string
    isLoading: boolean
    columns: DataTableColumn<any>[]
    records: any[] | undefined
    buttonLabel?: string
    buttonOnClick?: () => void
    rowOnClick: (row: any) => void
}

const LeaveTableCard = (props: LeaveTableCardProps) => {
    const { classes } = useStyles()
    const navigate = useNavigate()

    return (
        <Paper shadow="md" w="100%" h="100%" radius="lg" p="lg">
            <Title mb={"md"}>{props.title}</Title>
            <Box mb={"md"} h={props.buttonLabel ? "85%" : "92%"}>
                <DataTable
                    className={classes.table}
                    withBorder
                    withColumnBorders
                    highlightOnHover
                    textSelectionDisabled
                    borderRadius="md"
                    rowBorderColor={theme => theme.colors.brand[1]}
                    rowStyle={{
                        backgroundColor: "hsl(0, 100%, 97%)",
                    }}
                    minHeight={200}
                    fetching={props.isLoading}
                    loaderVariant="dots"
                    onRowClick={props.rowOnClick}
                    emptyState={
                        <Stack align="center" spacing="xs">
                            <ContentPaste size={32} color="#f58a9b" />
                            <Title color="brand.2" size="h5">
                                No records found
                            </Title>
                        </Stack>
                    }
                    columns={props.columns}
                    records={props.records}
                />
            </Box>
            <Button
                display={props.buttonLabel ? "" : "none"}
                fullWidth
                onClick={props.buttonOnClick}>
                {props.buttonLabel}
            </Button>
        </Paper>
    )
}

export default LeaveTableCard
