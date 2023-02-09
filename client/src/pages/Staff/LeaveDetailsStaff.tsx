import {
    Grid,
    Paper,
    Title,
    Skeleton,
    LoadingOverlay,
    Group,
    Stack,
    TextInput,
    Select,
    FileInput,
    Textarea,
    Button,
} from "@mantine/core"
import { DateRangePickerValue, DateRangePicker } from "@mantine/dates"
import { useForm, matches, isNotEmpty } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import { Download } from "@styled-icons/material-rounded"
import { DateTime } from "luxon"
import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useSWR, { mutate, Key } from "swr"
import { baseUrl, fetcher } from "../../app/services/api"
import useAppStore from "../../app/Store"
import StudentInfoCard from "../../components/StudentInfoCard"
import {
    LeaveType,
    LOARecordAPI,
    MCRecordAPI,
    LOARecord,
    MCRecord,
    LOAReasons,
    MCReasons,
} from "../../types/Leave"
import { S3LinkAPI } from "../../types/S3"

interface LeaveRequestForm {
    contactNumber: string
    reason: LOAReasons | MCReasons | ""
    duration: DateRangePickerValue | undefined
    document: File | null
    additionalInfo: string
    gradedAssignment: "true" | "false" | boolean
    mcNumber: string
    clinicName: string
}

const LeaveDetailsStaff = () => {
    const tokens = useAppStore(state => state.tokens)
    const user = useAppStore(state => state.userInfo)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { id, type } = useParams()

    const navigate = useNavigate()

    const form = useForm<LeaveRequestForm>({
        initialValues: {
            contactNumber: "",
            reason: "",
            duration: undefined,
            document: null,
            additionalInfo: "",
            gradedAssignment: "false",
            mcNumber: "",
            clinicName: "",
        },
    })

    const uid: Key = [`${baseUrl}/leave/${id}`, tokens.id_token]

    const { data, error, isLoading } = useSWR<
        LOARecordAPI | MCRecordAPI,
        Error
    >(user ? uid : null, ([url, token]) => fetcher(url, token))

    const S3LinkUid: Key = [
        `${baseUrl}/S3/leave/${data?.record.attachment}`,
        tokens.id_token,
    ]

    const { data: S3LinkData, error: S3LinkError } = useSWR<S3LinkAPI, Error>(
        data ? S3LinkUid : null,
        ([url, token]) => fetcher(url, token),
    )

    useEffect(() => {
        form.setFieldValue("contactNumber", user?.phoneNumber!)
    }, [user])

    useEffect(() => {
        if (type !== LeaveType.LOA && type !== LeaveType.MC) {
            navigate("/student/leave")
        }
    }, [type])

    useEffect(() => {
        if (data) {
            if (type === LeaveType.LOA) {
                const loaRecord = data.record as LOARecord

                form.setValues({
                    contactNumber: loaRecord.contact_number,
                    reason: loaRecord.reason,
                    duration: loaRecord.duration.map(date => {
                        return DateTime.fromISO(date).toJSDate()
                    }) as DateRangePickerValue,
                    document: null,
                    additionalInfo: loaRecord.additional_information,
                    gradedAssignment: loaRecord.graded_assignment
                        ? "true"
                        : "false",
                })
            } else {
                const mcRecord = data.record as MCRecord

                form.setValues({
                    contactNumber: mcRecord.contact_number,
                    reason: mcRecord.reason,
                    duration: mcRecord.duration.map(date => {
                        return DateTime.fromISO(date).toJSDate()
                    }) as DateRangePickerValue,
                    document: null,
                    additionalInfo: mcRecord.additional_information,
                    mcNumber: mcRecord.mc_number,
                    clinicName: mcRecord.clinic,
                })
            }
        }
    }, [data])

    const downloadDocument = () => {
        if (S3LinkData) {
            window.open(S3LinkData.url, "_blank")
        } else {
            showNotification({
                title: "Download failed",
                message:
                    "Something went wrong with downloading your document. Please try again later.",
            })
        }
    }

    const approveRequest = async () => {
        setIsSubmitting(true)
        const url = `${baseUrl}/leave/approveRequest`

        const body = JSON.stringify({
            student_id: data?.record.student_id,
            leave_id: data?.record.leave_id,
        })

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    Authorization: tokens.id_token?.toString() || "",
                    "Content-Type": "application/json",
                },
                body,
            })

            if (response.status === 200) {
                showNotification({
                    title: "Request approved",
                    color: "green",
                    message: "The request has been approved successfully.",
                })
                const uid: Key = [
                    `${baseUrl}/leave/requests/${user?.username}/${type}`,
                    tokens.id_token,
                ]
                mutate(uid)
                setIsSubmitting(false)
                navigate("/staff/leave")
            }
        } catch (error) {
            showNotification({
                title: "Request approval failed",
                message:
                    "Something went wrong with approving the request. Please try again later.",
            })
            setIsSubmitting(false)

            navigate("/staff/leave")
        }
    }

    const rejectRequest = async () => {
        setIsSubmitting(true)
        const url = `${baseUrl}/leave/rejectRequest`

        const body = JSON.stringify({
            student_id: data?.record.student_id,
            leave_id: data?.record.leave_id,
        })

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    Authorization: tokens.id_token?.toString() || "",
                    "Content-Type": "application/json",
                },
                body,
            })

            if (response.status === 200) {
                showNotification({
                    title: "Request rejected",
                    color: "green",
                    message: "The request has been rejected successfully.",
                })
                const uid: Key = [
                    `${baseUrl}/leave/requests/${user?.username}/${type}`,
                    tokens.id_token,
                ]
                mutate(uid)
                setIsSubmitting(false)
                navigate("/staff/leave")
            }
        } catch (error) {
            showNotification({
                title: "Request rejection failed",
                message:
                    "Something went wrong with rejecting the request. Please try again later.",
            })
            setIsSubmitting(false)
            navigate("/staff/leave")
        }
    }

    return (
        <Grid h={"100%"} p="md" gutter={"xl"}>
            <Grid.Col sx={{ minHeight: "10%" }}>
                <StudentInfoCard
                    type="wide"
                    username={data?.record.student_id}
                    isDataLoading={isLoading}
                />
            </Grid.Col>

            <Grid.Col sx={{ minHeight: "90%" }}>
                <Paper h={"100%"} shadow="md" radius="lg" p="lg">
                    <Title pb={"xl"}>
                        {type === LeaveType.LOA
                            ? "Leave of Absence (LOA) Details"
                            : "Medical Certificate (MC) Details"}
                    </Title>
                    <Skeleton visible={isLoading}>
                        <form>
                            <LoadingOverlay
                                loaderProps={{ variant: "dots" }}
                                transitionDuration={150}
                                visible={isSubmitting}
                                overlayBlur={1}
                            />
                            <Group pb={30} grow sx={{ alignItems: "start" }}>
                                <Stack spacing="lg">
                                    <TextInput
                                        withAsterisk
                                        readOnly
                                        label="Contact number"
                                        placeholder="Enter your contact number"
                                        {...form.getInputProps("contactNumber")}
                                    />
                                    <Select
                                        withAsterisk
                                        readOnly
                                        label={`Reason for ${type}`}
                                        placeholder="Select a reason"
                                        data={
                                            type === LeaveType.LOA
                                                ? [
                                                      {
                                                          value: "School event",
                                                          label: "School event",
                                                      },
                                                      {
                                                          value: "External event",
                                                          label: "External event",
                                                      },
                                                      {
                                                          value: "Family emergency",
                                                          label: "Family emergency",
                                                      },
                                                      {
                                                          value: "Others",
                                                          label: "Others",
                                                      },
                                                  ]
                                                : [
                                                      {
                                                          value: "Medical leave",
                                                          label: "Medical leave",
                                                      },
                                                      {
                                                          value: "Hospitalisation leave",
                                                          label: "Hospitalisation leave",
                                                      },
                                                  ]
                                        }
                                        {...form.getInputProps("reason")}
                                    />
                                    <DateRangePicker
                                        withAsterisk
                                        readOnly
                                        defaultValue={undefined}
                                        label={`Duration of ${type}`}
                                        placeholder="Select a date range"
                                        {...form.getInputProps("duration")}
                                    />
                                    <FileInput
                                        readOnly
                                        label="Supporting Documents"
                                        icon={<Download size={24} />}
                                        placeholder={
                                            isLoading
                                                ? "Loading..."
                                                : data?.record.attachment
                                        }
                                        onClick={downloadDocument}
                                        description="Please only upload PDF files"
                                        {...form.getInputProps("document")}
                                    />
                                </Stack>
                                <Stack spacing="lg">
                                    <Select
                                        display={
                                            type === LeaveType.LOA ? "" : "none"
                                        }
                                        withAsterisk
                                        readOnly
                                        label="Graded Assignment"
                                        placeholder="Select if you have a graded assignment during this period"
                                        data={[
                                            {
                                                value: "true",
                                                label: "Yes",
                                            },
                                            {
                                                value: "false",
                                                label: "No",
                                            },
                                        ]}
                                        {...form.getInputProps(
                                            "gradedAssignment",
                                        )}
                                    />

                                    <TextInput
                                        display={
                                            type === LeaveType.MC ? "" : "none"
                                        }
                                        withAsterisk
                                        label="MC Number"
                                        {...form.getInputProps("mcNumber")}
                                    />
                                    <TextInput
                                        display={
                                            type === LeaveType.MC ? "" : "none"
                                        }
                                        withAsterisk
                                        label="Clinic Name"
                                        {...form.getInputProps("clinicName")}
                                    />

                                    <Textarea
                                        readOnly
                                        label="Additional Information"
                                        placeholder={`Please enter any other relevant information`}
                                        minRows={type === LeaveType.LOA ? 9 : 5}
                                        {...form.getInputProps(
                                            "additionalInfo",
                                        )}
                                    />
                                </Stack>
                            </Group>
                            <Stack mt={40}>
                                <Button
                                    color={"green.4"}
                                    onClick={approveRequest}>
                                    Approve
                                </Button>
                                <Button onClick={rejectRequest}>Reject</Button>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(-1)}>
                                    Back
                                </Button>
                            </Stack>
                        </form>
                    </Skeleton>
                </Paper>
            </Grid.Col>
        </Grid>
    )
}

export default LeaveDetailsStaff
