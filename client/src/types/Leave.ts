import { DateTime } from "luxon"

export enum LeaveType {
    LOA = "LOA",
    MC = "MC",
}

export interface LOARecord {
    student_id: string
    staff_id: string
    leave_id: string
    contact_number: string
    reason: LOAReasons
    duration: string[]
    attachment: string
    graded_assignment: boolean
    additional_information?: string
    type: LeaveType.LOA
    approved: boolean
}

export interface MCRecord {
    student_id: string
    staff_id: string
    leave_id: string
    contact_number: string
    reason: MCReasons
    duration: string[]
    attachment: string
    mc_number: string
    clinic: string
    additional_information?: string
    type: LeaveType.MC
    approved: boolean
}

export interface LOARecordsAPI {
    message: string
    items: LOARecord[]
}

export interface MCRecordsAPI {
    message: string
    items: MCRecord[]
}

export interface LOARecordAPI {
    message: string
    record: LOARecord
}

export interface MCRecordAPI {
    message: string
    record: MCRecord
}

export type LOAReasons =
    | "School event"
    | "External event"
    | "Family emergency"
    | "Others"

export type MCReasons = "Medical leave" | "Hospitalization leave"
