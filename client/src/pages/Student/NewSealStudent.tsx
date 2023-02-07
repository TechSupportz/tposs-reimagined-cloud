import {
    FileInput,
    Input,
    Select,
    Stack,
    Textarea,
    TextInput,
    Button,
} from "@mantine/core"
import { DateRangePicker, DateRangePickerValue } from "@mantine/dates"
import { useForm } from "@mantine/form"
import { CalendarMonth } from "@styled-icons/material-rounded"
import { useState } from "react"

const NewSealStudent = () => {
    const [value, setValue] = useState<DateRangePickerValue>([
        new Date(2021, 11, 1),
        new Date(2021, 11, 5),
    ])

    const form = useForm({
        initialValues: {
            name: "",
            type: "",
            duration: "",
        },

    })

    return (
        <Stack spacing="xl" >
            <TextInput
                required
                label="Name of event"
                placeholder="Enter the name of the event"
            />
            <Select
                required
                label="Type of event"
                placeholder="Select type of event"
                data={[
                    { value: "Service", label: "Service" },
                    { value: "Enrichment", label: "Enrichment" },
                    { value: "Achievement", label: "Achievement" },
                    { value: "Leadership", label: "Leadership" },
                ]}
            />
            <DateRangePicker
                required
                value={value}
                onChange={setValue}
                label="Duration of event"
                placeholder="Select when the event took place"
            />
            <FileInput
                label="Supporting Documents"
                placeholder="Upload a document"
                description="Please only upload PDF files"
            />
            <Textarea label="Award details (If applicable)" />
            <Textarea
                label="Group member details (If applicable)"
                placeholder={`Please enter details in this format\nName, Admin number`}
            />
            <Button>Submit</Button>
        </Stack>
    )
}

export default NewSealStudent
