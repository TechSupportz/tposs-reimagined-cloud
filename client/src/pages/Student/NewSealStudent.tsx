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
} from "@mantine/core"
import { DateRangePicker, DateRangePickerValue } from "@mantine/dates"
import { isNotEmpty, useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import { CalendarMonth } from "@styled-icons/material-rounded"
import { useState } from "react"
import useSWR, { Key, mutate } from "swr"
import { baseUrl, fetcher } from "../../app/services/api"
import useAppStore from "../../app/Store"
import { SEALType } from "../../types/SEAL"
import { DateTime } from "luxon"
import { useNavigate } from "react-router-dom"
import StudentInfoCard from "../../components/StudentInfoCard"

interface SealRequestForm {
    name: string
    type: SEALType | null
    duration: DateRangePickerValue | undefined
    document: File | null
    involvement: string
    awardDetails: string
    groupMembers: string
}

interface S3UploadLink {
    url: string
    key: string
}

const NewSealStudent = () => {
    const tokens = useAppStore(state => state.tokens)
    const user = useAppStore(state => state.userInfo)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigate = useNavigate()

    const form = useForm<SealRequestForm>({
        initialValues: {
            name: "",
            type: null,
            duration: undefined,
            document: null,
            involvement: "",
            awardDetails: "",
            groupMembers: "",
        },
        validateInputOnBlur: true,
        validateInputOnChange: true,
        validate: {
            name: isNotEmpty("Please enter the name of the event"),
            type: isNotEmpty("Please select a type"),
            duration: isNotEmpty("Please select a duration"),
            document: isNotEmpty("Please upload a document"),
            involvement: isNotEmpty("Please enter your involvement"),
        },
    })

    const submitForm = async () => {
        form.validate()
        // console.log(form.values)

        if (form.isValid()) {
            setIsSubmitting(true)
            const fileKey = await uploadDocument(form.values.document!)
            postNewSEALRequest(fileKey!)
        } else {
            console.log("Form is invalid")
        }
    }

    const postNewSEALRequest = async (fileKey: string) => {
        const body = JSON.stringify({
            name: form.values.name,
            student_id: user?.username,
            staff_id: "carePersonId" in user! && user.carePersonId,
            attachment_key: fileKey,
            award_details: form.values.awardDetails,
            duration: form.values.duration?.map(date => {
                return DateTime.fromJSDate(date!).toISODate()
            }),
            involvement: form.values.involvement,
            members: form.values.groupMembers,
            type: form.values.type,
        })

        const url = `${baseUrl}/SEAL/newRequest`

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
                    `${baseUrl}/SEAL/${user?.username}/${form.values.type}`,
                    tokens.id_token,
                ]
                mutate(uid)
                setIsSubmitting(false)
                navigate("/student/seal")
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
        const url = `${baseUrl}/SEAL/uploadLink/${user?.username}`

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
                    <form onSubmit={form.onSubmit(() => submitForm())}>
                        <LoadingOverlay
                            transitionDuration={150}
                            visible={isSubmitting}
                            overlayBlur={1}
                        />
                        <Group pb={30} grow sx={{ alignItems: "start" }}>
                            <Stack spacing="lg">
                                <TextInput
                                    withAsterisk
                                    label="Name of event"
                                    placeholder="Enter the name of the event"
                                    {...form.getInputProps("name")}
                                />
                                <Select
                                    withAsterisk
                                    label="Type of event"
                                    placeholder="Select type of event"
                                    data={[
                                        { value: "Service", label: "Service" },
                                        {
                                            value: "Enrichment",
                                            label: "Enrichment",
                                        },
                                        {
                                            value: "Achievement",
                                            label: "Achievement",
                                        },
                                        {
                                            value: "Leadership",
                                            label: "Leadership",
                                        },
                                    ]}
                                    {...form.getInputProps("type")}
                                />
                                <TextInput
                                    withAsterisk
                                    label="Involvement"
                                    placeholder="Enter your involvement in the event"
                                    {...form.getInputProps("involvement")}
                                />
                                <DateRangePicker
                                    withAsterisk
                                    defaultValue={undefined}
                                    label="Duration of event"
                                    placeholder="Select when the event took place"
                                    {...form.getInputProps("duration")}
                                />
                                <FileInput
                                    label="Supporting Documents"
                                    placeholder="Upload a document"
                                    description="Please only upload PDF files"
                                    {...form.getInputProps("document")}
                                />
                            </Stack>
                            <Stack spacing="lg">
                                <Textarea
                                    label="Award details (If applicable)"
                                    placeholder={`Please enter details of any awards you have received`}
                                    minRows={5}
                                    {...form.getInputProps("awardDetails")}
                                />
                                <Textarea
                                    label="Group member details (If applicable)"
                                    placeholder={`Please enter details in this format\nName, Admin number`}
                                    minRows={8}
                                    {...form.getInputProps("groupMembers")}
                                />
                            </Stack>
                        </Group>
                        <Stack>
                            <Button type="submit">Submit</Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Grid.Col>
        </Grid>
    )
}

export default NewSealStudent
