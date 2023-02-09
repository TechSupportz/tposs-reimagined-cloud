import { Flex, Stack } from "@mantine/core"
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useSWR, { Key } from "swr"
import { baseUrl, fetcher } from "../../app/services/api"
import useAppStore from "../../app/Store"
import TableCard from "../../components/TableCard"
import { LOARecord, LOARecordsAPI, MCRecordsAPI } from "../../types/Leave"

const LeaveStudent = () => {
    const user = useAppStore(state => state.userInfo)
    const tokens = useAppStore(state => state.tokens)

    const navigate = useNavigate()

    const loaUID: Key = [
        `${baseUrl}/leave/${user?.username}/LOA`,
        tokens.id_token,
    ]

    const mcUID: Key = [
        `${baseUrl}/leave/${user?.username}/MC`,
        tokens.id_token,
    ]

    const {
        data: loaData,
        error: loaError,
        isLoading: loaIsLoading,
    } = useSWR<LOARecordsAPI, Error>(loaUID, ([url, token]) =>
        fetcher(url, token),
    )

    const {
        data: mcData,
        error: mcError,
        isLoading: mcIsLoading,
    } = useSWR<MCRecordsAPI, Error>(mcUID, ([url, token]) =>
        fetcher(url, token),
    )

    useEffect(() => {
        console.log(mcData)
    }, [mcData])

    return (
        <Flex h="100%" w={"100%"} justify="space-around" gap={36} p="md">
            <TableCard
                title="Leave of Absence (LOA) Summary"
                isLoading={loaIsLoading}
                columns={[
                    {
                        accessor: "Duration",
                    },
                    {
                        accessor: "Status",
                    },
                    {
                        accessor: "Reason for Absence",
                    },
                ]}
                records={loaData?.items.map(record => ({
                    Duration: record.duration.join(" - "),
                    Status: record.approved ? "Approved" : "Pending",
                    "Reason for Absence": record.reason,
                    Key: record.leave_id,
                }))}
                rowOnClick={row => {
                    navigate(`${row.Key}/LOA`)
                }}
                buttonLabel="Apply for LOA"
                buttonOnClick={() => {
                    navigate("new/LOA")
                }}
            />
            <TableCard
                title="Medical Certificate (MC) Summary"
                isLoading={mcIsLoading}
                columns={[
                    {
                        accessor: "Duration",
                    },
                    {
                        accessor: "Status",
                    },
                    {
                        accessor: "MC Num",
                        title: "MC No.",
                    },
                    {
                        accessor: "Clinic",
                    },
                ]}
                records={mcData?.items.map(record => ({
                    Duration: record.duration.join(" - "),
                    Status: record.approved ? "Approved" : "Pending",
                    "MC Num": record.mc_number,
                    Clinic: record.clinic,
                    Key: record.leave_id,
                }))}
                rowOnClick={row => {
                    navigate(`${row.Key}/MC`)
                }}
                buttonLabel="Apply for MC"
                buttonOnClick={() => {
                    navigate("new/MC")
                }}
            />
        </Flex>
    )
}

export default LeaveStudent
