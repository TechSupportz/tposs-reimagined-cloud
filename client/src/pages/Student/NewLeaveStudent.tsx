import {
    FileInput,
    Input,
    Select,
    Stack,
    Textarea,
    TextInput,
    Button,
    LoadingOverlay,
    Box,
    Paper,
    Flex,
    Group,
    Grid,
    Title,
    Tooltip,
    Skeleton,
} from "@mantine/core"
import { DateRangePicker, DateRangePickerValue } from "@mantine/dates"
import { isNotEmpty, matches, useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import { CalendarMonth, Download } from "@styled-icons/material-rounded"
import { useEffect, useState } from "react"
import useSWR, { Key, mutate } from "swr"
import { baseUrl, fetcher } from "../../app/services/api"
import useAppStore from "../../app/Store"
import { SEALRecord, SEALRecordAPI, SEALType } from "../../types/SEAL"
import { DateTime } from "luxon"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import StudentInfoCard from "../../components/StudentInfoCard"
import {
    LeaveType,
    LOAReasons,
    LOARecord,
    LOARecordAPI,
    MCReasons,
    MCRecord,
    MCRecordAPI,
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

interface S3UploadLink {
    url: string
    key: string
}

const NewLeaveStudent = (props: { isReadOnly: boolean }) => {
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
        validateInputOnBlur: !props.isReadOnly,
        validateInputOnChange: false,
        validate: {
            contactNumber: matches(
                /\+65(6|8|9)\d{7}/g,
                "Please enter a valid Singapore contact number",
            ),
            reason: isNotEmpty("Please select a reason"),
            duration: isNotEmpty("Please select a duration"),
            document: isNotEmpty("Please upload a document"),
            mcNumber: value =>
                type === LeaveType.MC && value.length === 0
                    ? "Please enter your MC Number"
                    : null,
            clinicName: value =>
                type === LeaveType.MC && value.length === 0
                    ? "Please enter the name of the clinic"
                    : null,
            additionalInfo: (value, values) =>
                values.reason === "Others" &&
                value.length === 0 &&
                values.gradedAssignment === "true"
                    ? "Please specify your reason for LOA and the name of the subject which is affected"
                    : values.reason === "Others" && value.length === 0
                    ? "Please specify your reason for LOA"
                    : values.gradedAssignment === "true" && value.length === 0
                    ? "Please specify the name of the subject which is affected"
                    : null,
        },
    })

    const uid: Key = [`${baseUrl}/leave/${id}`, tokens.id_token]

    const { data, error, isLoading } = useSWR<
        LOARecordAPI | MCRecordAPI,
        Error
    >(props.isReadOnly ? uid : null, ([url, token]) => fetcher(url, token))

    const S3LinkUid: Key = [
        `${baseUrl}/S3/leave/${data?.record.attachment}`,
        tokens.id_token,
    ]

    const { data: S3LinkData, error: S3LinkError } = useSWR<S3LinkAPI, Error>(
        data && props.isReadOnly ? S3LinkUid : null,
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
            setIsSubmitting(false)
        }
    }, [data])

    const submitForm = async () => {
        form.validate()

        if (form.isValid()) {
            setIsSubmitting(true)
            const fileKey = await uploadDocument(form.values.document!)
            console.log(fileKey)
            postNewLeaveRequest(fileKey!)
        } else {
            console.log("Form is invalid")
        }
    }

    const postNewLeaveRequest = async (fileKey: string) => {
        let body: string

        if (type === LeaveType.LOA) {
            const gradedAssignment = form.values.gradedAssignment === "true"

            body = JSON.stringify({
                student_id: user?.username,
                staff_id: "carePersonId" in user! && user.carePersonId,
                type: type,
                reason: form.values.reason,
                duration: form.values.duration?.map(date => {
                    return DateTime.fromJSDate(date!).toISODate()
                }),
                additional_information: form.values.additionalInfo,
                attachment: fileKey,
                contact_number: form.values.contactNumber,
                graded_assignment: gradedAssignment,
            })
        } else {
            body = JSON.stringify({
                student_id: user?.username,
                staff_id: "carePersonId" in user! && user.carePersonId,
                type: type,
                reason: form.values.reason,
                duration: form.values.duration?.map(date => {
                    return DateTime.fromJSDate(date!).toISODate()
                }),
                additional_information: form.values.additionalInfo,
                attachment: fileKey,
                contact_number: form.values.contactNumber,
                mc_number: form.values.mcNumber,
                clinic: form.values.clinicName,
            })
        }

        console.log(body)

        const url = `${baseUrl}/leave/newRequest`

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: tokens.id_token?.toString() || "",
                    "Content-Type": "application/json",
                },
                body,
            })

            if (response.status === 200) {
                showNotification({
                    title: "Success",
                    color: "green",
                    message: "Your request has been submitted.",
                })
                const uid: Key = [
                    `${baseUrl}/leave/${user?.username}/${type}`,
                    tokens.id_token,
                ]
                mutate(uid)
                setIsSubmitting(false)
                navigate("/student/leave")
            }
        } catch (error) {
            console.error(error)
            showNotification({
                title: "Submission failed",
                message:
                    "Something went wrong while submitting your request. Please try again later.",
            })
        }
    }

    const uploadDocument = async (file: File) => {
        const url = `${baseUrl}/leave/uploadLink/${user?.username}`

        const s3Response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: tokens.id_token?.toString() || "",
                "Content-Type": "application/json",
            },
        })

        const s3UploadLink = (await s3Response.json()) as S3UploadLink

        try {
            const uploadResponse = await fetch(s3UploadLink.url, {
                method: "PUT",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                body: file,
            })

            if (uploadResponse.status === 200) return s3UploadLink.key
        } catch (error) {
            console.error(error)
            showNotification({
                title: "Upload failed",
                message:
                    "Something went wrong while uploading your document. Please try again later.",
            })
        }
    }

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

    return (
        <Grid h={"100%"} p="md" gutter={"xl"}>
            <Grid.Col sx={{ minHeight: "10%" }}>
                <StudentInfoCard type="wide" />
            </Grid.Col>

            <Grid.Col sx={{ minHeight: "90%" }}>
                <Paper h={"100%"} shadow="md" radius="lg" p="lg">
                    <Title pb={"xl"}>
                        {type === LeaveType.LOA
                            ? "Leave of Absence (LOA) Details"
                            : "Medical Certificate (MC) Details"}
                    </Title>
                    <Skeleton visible={props.isReadOnly && isLoading}>
                        <form onSubmit={form.onSubmit(() => submitForm())}>
                            <LoadingOverlay
                                loaderProps={{ variant: "dots" }}
                                transitionDuration={150}
                                visible={isSubmitting && !props.isReadOnly}
                                overlayBlur={1}
                            />
                            <Group pb={30} grow sx={{ alignItems: "start" }}>
                                <Stack spacing="lg">
                                    <TextInput
                                        withAsterisk
                                        readOnly={props.isReadOnly}
                                        label="Contact number"
                                        placeholder="Enter your contact number"
                                        {...form.getInputProps("contactNumber")}
                                    />
                                    <Select
                                        withAsterisk
                                        readOnly={props.isReadOnly}
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
                                        readOnly={props.isReadOnly}
                                        defaultValue={undefined}
                                        label={`Duration of ${type}`}
                                        placeholder="Select a date range"
                                        {...form.getInputProps("duration")}
                                    />
                                    <FileInput
                                        readOnly={props.isReadOnly}
                                        label="Supporting Documents"
                                        icon={
                                            props.isReadOnly ? (
                                                <Download size={24} />
                                            ) : null
                                        }
                                        placeholder={
                                            props.isReadOnly
                                                ? isLoading
                                                    ? "Loading..."
                                                    : data?.record.attachment
                                                : "Upload a document"
                                        }
                                        onClick={
                                            props.isReadOnly
                                                ? downloadDocument
                                                : undefined
                                        }
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
                                        readOnly={props.isReadOnly}
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
                                        readOnly={props.isReadOnly}
                                        label="Additional Information"
                                        placeholder={props.isReadOnly ? "" : `Please enter any other relevant information`}
                                        minRows={type === LeaveType.LOA ? 9 : 5}
                                        {...form.getInputProps(
                                            "additionalInfo",
                                        )}
                                    />
                                </Stack>
                            </Group>
                            <Stack mt={props.isReadOnly ? 150 : 100}>
                                <Button
                                    display={props.isReadOnly ? "none" : ""}
                                    type="submit">
                                    Submit
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(-1)}>
                                    {props.isReadOnly ? "Back" : "Cancel"}
                                </Button>
                            </Stack>
                        </form>
                    </Skeleton>
                </Paper>
            </Grid.Col>
        </Grid>
    )
}

export default NewLeaveStudent
