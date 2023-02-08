import { Paper, Title } from "@mantine/core"
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
}

const LeaveTableCard = (props: LeaveTableCardProps) => {
    const { classes } = useStyles()
    const navigate = useNavigate()

    return (
        <Paper shadow="md" h="100%" radius="lg" p="lg">
            <Title>{props.title}</Title>
            <DataTable
                className={classes.table}
                withBorder
                withColumnBorders
                highlightOnHover
                borderRadius="md"
                rowBorderColor={theme => theme.colors.brand[1]}
                rowStyle={{ backgroundColor: "hsl(0, 100%, 97%)", borderColor: "hsl(0, 100%, 97%)" }}
                fetching={props.isLoading}
                loaderVariant="dots"
                onRowClick={row => {
                    navigate(`${row.Key}`)
                }}
                columns={props.columns}
                records={props.records}
                textSelectionDisabled></DataTable>
        </Paper>
    )
}

export default LeaveTableCard
