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
import { useLocation, useNavigate } from "react-router-dom"
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

interface GroupMember {
    name: string
    admission_number: string
}

interface S3UploadLink {
    url: string
    key: string
}

const NewSealStudent = (props: { isReadOnly: boolean }) => {
    const tokens = useAppStore(state => state.tokens)
    const user = useAppStore(state => state.userInfo)
    const [isSubmitting, setIsSubmitting] = useState(props.isReadOnly)
    const url = useLocation().pathname

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
        validateInputOnBlur: !props.isReadOnly,
        validateInputOnChange: false,
        validate: {
            name: isNotEmpty("Please enter the name of the event"),
            type: isNotEmpty("Please select a type"),
            duration: isNotEmpty("Please select a duration"),
            document: isNotEmpty("Please upload a document"),
            involvement: isNotEmpty("Please enter your involvement"),
            groupMembers: matches(
                /^(([a-zA-Z]+(([ ]+[a-zA-Z]+)?)+,[ ]*[0-9]{7}[a-zA-Z](\n|$))*|)$/,
                "Please enter group members in the correct format",
            ),
        },
    })

    const uid: Key = [
        `${baseUrl}/SEAL/${url.split("/").pop()}`,
        tokens.id_token,
    ]

    const { data, error, isLoading } = useSWR<SEALRecordAPI, Error>(
        props.isReadOnly ? uid : null,
        ([url, token]) => fetcher(url, token),
    )

    useEffect(() => {
        if (data) {
            const sealRecord: SEALRecord = data.record

            form.setValues({
                name: sealRecord.name,
                type: sealRecord.type,
                duration: sealRecord.duration?.map(date => {
                    return DateTime.fromISO(date).toJSDate()
                }) as DateRangePickerValue,
                document: null,
                involvement: sealRecord.involvement,
                awardDetails: sealRecord.award_details,
                groupMembers: sealRecord.members
                    .map(member => {
                        return `${member.name}, ${member.admission_number}`
                    })
                    .join("\n"),
            })
            setIsSubmitting(false)
        }
    }, [data])

    const submitForm = async () => {
        form.validate()

        let grpMemberList: GroupMember[] | [] = []

        if (form.values.groupMembers !== "") {
            grpMemberList = form.values.groupMembers
                .split("\n")
                .map(member => {
                    const memberSplit = member.split(",")
                    return {
                        name: memberSplit[0],
                        admission_number: memberSplit[1].trim(),
                    }
                })
        }

        if (form.isValid()) {
            setIsSubmitting(true)
            const fileKey = await uploadDocument(form.values.document!)
            postNewSEALRequest(fileKey!, grpMemberList)
        } else {
            console.log("Form is invalid")
        }
    }

    const postNewSEALRequest = async (
        fileKey: string,
        groupMemberList: GroupMember[] | [],
    ) => {
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
            members: groupMemberList,
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
                    <Skeleton visible={props.isReadOnly && isLoading}>
                        <form onSubmit={form.onSubmit(() => submitForm())}>
                            <LoadingOverlay
                                loaderProps={{variant: "dots"}}
                                transitionDuration={150}
                                visible={isSubmitting &&!props.isReadOnly}
                                overlayBlur={1}
                            />
                            <Group pb={30} grow sx={{ alignItems: "start" }}>
                                <Stack spacing="lg">
                                    <TextInput
                                        withAsterisk
                                        readOnly={props.isReadOnly}
                                        label="Name of event"
                                        placeholder="Enter the name of the event"
                                        {...form.getInputProps("name")}
                                    />
                                    <Select
                                        withAsterisk
                                        readOnly={props.isReadOnly}
                                        label="Type of event"
                                        placeholder="Select type of event"
                                        data={[
                                            {
                                                value: "Service",
                                                label: "Service",
                                            },
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
                                        readOnly={props.isReadOnly}
                                        label="Involvement"
                                        placeholder="Enter your involvement in the event"
                                        {...form.getInputProps("involvement")}
                                    />
                                    <DateRangePicker
                                        withAsterisk
                                        readOnly={props.isReadOnly}
                                        defaultValue={undefined}
                                        label="Duration of event"
                                        placeholder="Select when the event took place"
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
                                    <Textarea
                                        readOnly={props.isReadOnly}
                                        label="Award details (If applicable)"
                                        placeholder={
                                            form.values.type &&
                                            form.values.type !== "Achievement"
                                                ? `Not applicable for ${form.values.type} events`
                                                : `Please enter details of any awards you have received`
                                        }
                                        minRows={5}
                                        disabled={
                                            form.values.type !== "Achievement"
                                        }
                                        {...form.getInputProps("awardDetails")}
                                    />

                                    <Textarea
                                        readOnly={props.isReadOnly}
                                        label="Group member details (If applicable)"
                                        placeholder={`Please enter details in this format\nName one, Admin number\nName two, Admin number`}
                                        minRows={8}
                                        {...form.getInputProps("groupMembers")}
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

export default NewSealStudent
