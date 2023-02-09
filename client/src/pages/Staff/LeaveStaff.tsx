import { Flex } from "@mantine/core"
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useSWR, { Key } from "swr"
import { baseUrl, fetcher } from "../../app/services/api"
import useAppStore from "../../app/Store"
import TableCard from "../../components/TableCard"
import { LOARecordsAPI, MCRecordsAPI } from "../../types/Leave"

const LeaveStaff = () => {
    const user = useAppStore(state => state.userInfo)
    const tokens = useAppStore(state => state.tokens)

    const navigate = useNavigate()

    const loaUID: Key = [
        `${baseUrl}/leave/requests/${user?.username}/LOA`,
        tokens.id_token,
    ]

    const mcUID: Key = [
        `${baseUrl}/leave/requests/${user?.username}/MC`,
        tokens.id_token,
    ]

    const {
        data: loaData,
        error: loaError,
        isLoading: loaIsLoading,
    } = useSWR<LOARecordsAPI, Error>(user ? loaUID : null, ([url, token]) =>
        fetcher(url, token),
    )

    const {
        data: mcData,
        error: mcError,
        isLoading: mcIsLoading,
    } = useSWR<MCRecordsAPI, Error>(user ? mcUID : null, ([url, token]) =>
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
                        width: "32%",
                    },
                    {
                        accessor: "Reason for Absence",
                    },
                    {
                        accessor: "Student",
                    },
                ]}
                records={loaData?.items.map(record => ({
                    Duration: record.duration.join(" - "),
                    "Reason for Absence": record.reason,
                    Student: record.student_id,
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
                        width: "32%",
                    },
                    {
                        accessor: "MC Num",
                        title: "MC No.",
                    },
                    {
                        accessor: "Clinic",
                    },
                    {
                        accessor: "Student",
                    },
                ]}
                records={mcData?.items.map(record => ({
                    Duration: record.duration.join(" - "),
                    "MC Num": record.mc_number,
                    Clinic: record.clinic,
                    Student: record.student_id,
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

export default LeaveStaff
