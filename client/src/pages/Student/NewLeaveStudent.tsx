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
import { CalendarMonth } from "@styled-icons/material-rounded"
import { useEffect, useState } from "react"
import useSWR, { Key, mutate } from "swr"
import { baseUrl, fetcher } from "../../app/services/api"
import useAppStore from "../../app/Store"
import { SEALRecord, SEALRecordAPI, SEALType } from "../../types/SEAL"
import { DateTime } from "luxon"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import StudentInfoCard from "../../components/StudentInfoCard"
import { LeaveType } from "../../types/Leave"

interface LOARequestForm {
    contactNumber: string
    reason: string
    duration: DateRangePickerValue | undefined
    document: File | null
    gradedAssignment: "true" | "false" | boolean
    subjectAffected: string | null
    additionalInfo: string
}

interface S3UploadLink {
    url: string
    key: string
}

const NewLeaveStudent = (props: { isReadOnly: boolean }) => {
    const tokens = useAppStore(state => state.tokens)
    const user = useAppStore(state => state.userInfo)
    const [isSubmitting, setIsSubmitting] = useState(props.isReadOnly)
    const { type } = useParams() as { type: LeaveType }

    const navigate = useNavigate()

    const form = useForm<LOARequestForm>({
        initialValues: {
            contactNumber: "",
            reason: "",
            duration: undefined,
            document: null,
            gradedAssignment: "false",
            subjectAffected: null,
            additionalInfo: "",
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
            gradedAssignment: isNotEmpty("Please select an option"),
            // subjectAffected: value => {
            //     if (form.values.gradedAssignment && !value) {
            //         return "Please select a subject"
            //     }
            //     return null
            // },
            // additionalInfo: value => {
            //     if (form.values.reason === "Other") {
            //         return isNotEmpty("Please specify your reason for LOA")(
            //             value,
            //         )
            //     }
            //     return true
            // },
        },
    })

    // const uid: Key = [
    //     `${baseUrl}/SEAL/${id}`,
    //     tokens.id_token,
    // ]

    // const { data, error, isLoading } = useSWR<SEALRecordAPI, Error>(
    //     props.isReadOnly ? uid : null,
    //     ([url, token]) => fetcher(url, token),
    // )

    useEffect(() => {
        form.setFieldValue("contactNumber", user?.phoneNumber!)
    }, [user])

    useEffect(() => {
        if (type !== LeaveType.LOA && type !== LeaveType.MC) {
            navigate("/student/leave")
        }
    }, [type])

    // useEffect(() => {
    //     if (data) {
    //         const sealRecord: SEALRecord = data.record

    //         form.setValues({
    //             name: sealRecord.name,
    //             type: sealRecord.type,
    //             duration: sealRecord.duration?.map(date => {
    //                 return DateTime.fromISO(date).toJSDate()
    //             }) as DateRangePickerValue,
    //             document: null,
    //             involvement: sealRecord.involvement,
    //             awardDetails: sealRecord.award_details,
    //             additionalInfo: sealRecord.members
    //                 .map(member => {
    //                     return `${member.name}, ${member.admission_number}`
    //                 })
    //                 .join("\n"),
    //         })
    //         setIsSubmitting(false)
    //     }
    // }, [data])

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

        const gradedAssignment = form.values.gradedAssignment === "true"

        const body = JSON.stringify({
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
            subjectAffected: gradedAssignment
                ? form.values.subjectAffected
                : undefined,
        })

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

    return (
        <Grid h={"100%"} p="md" gutter={"xl"}>
            <Grid.Col sx={{ minHeight: "10%" }}>
                <StudentInfoCard type="wide" />
            </Grid.Col>

            <Grid.Col sx={{ minHeight: "90%" }}>
                <Paper h={"100%"} shadow="md" radius="lg" p="lg">
                    <Title pb={"xl"}>Event/Award Details</Title>
                    <Skeleton visible={false}>
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
                                        data={[
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
                                        ]}
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
                                        placeholder="Upload a document"
                                        description="Please only upload PDF files"
                                        {...form.getInputProps("document")}
                                    />
                                </Stack>
                                <Stack spacing="lg">
                                    <Select
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
                                            form.values.gradedAssignment ===
                                            "true"
                                                ? ""
                                                : "none"
                                        }
                                        withAsterisk
                                        label="Subject & Lecturer Name"
                                    />
                                    <Textarea
                                        readOnly={props.isReadOnly}
                                        label="Additional Information"
                                        placeholder={`Please enter any other relevant information`}
                                        minRows={
                                            form.values.gradedAssignment ===
                                            "true"
                                                ? 5
                                                : 8
                                        }
                                        {...form.getInputProps(
                                            "additionalInfo",
                                        )}
                                    />
                                </Stack>
                            </Group>
                            <Stack>
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
