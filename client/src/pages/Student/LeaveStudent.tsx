import React from "react"
import useSWR, { Key } from "swr"
import { baseUrl, fetcher } from "../../app/services/api"
import useAppStore from "../../app/Store"
import TableCard from "../../components/TableCard"
import { LOARecord, LOARecordsAPI, MCRecordsAPI } from "../../types/Leave"

const LeaveStudent = () => {
    const user = useAppStore(state => state.userInfo)
    const tokens = useAppStore(state => state.tokens)

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

    return (
        <>
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
                }))}
            />
        </>
    )
}

export default LeaveStudent
