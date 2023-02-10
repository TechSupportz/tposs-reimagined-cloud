import React from "react"
import { useNavigate } from "react-router-dom"
import useSWR, { Key } from "swr"
import { baseUrl, fetcher } from "../../app/services/api"
import useAppStore from "../../app/Store"
import TableCard from "../../components/TableCard"
import { SEALRequestsAPI } from "../../types/SEAL"

const SealStaff = () => {
    const user = useAppStore(state => state.userInfo)
    const tokens = useAppStore(state => state.tokens)

    const navigate = useNavigate()

    const uid: Key = [
        `${baseUrl}/SEAL/requests/${user?.username}`,
        tokens.id_token,
    ]

    const { data, error, isLoading } = useSWR<SEALRequestsAPI, Error>(
        user ? uid : null,
        ([url, token]) => fetcher(url, token),
    )

    return (
        <TableCard
            title="SEAL Point Requests"
            isLoading={isLoading}
            columns={[
                { accessor: "Academic Year", width: "15%" },
                { accessor: "Activity", width: "40%" },
                { accessor: "Type" },
                { accessor: "Student" },
            ]}
            records={data?.items.map(record => ({
                "Academic Year": record.duration[1].split("-")[0],
                Activity: record.name,
                Type: record.type,
                Student: record.student_id,
                Key: record.seal_id,
            }))}
            rowOnClick={row => {
                navigate(row.Key)
            }}
        />
    )
}

export default SealStaff
