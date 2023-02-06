export interface SEALPoint {
    message: string
    studentId: string
    points: number
    grade:
        | "Did not participate"
        | "Participated"
        | "Good"
        | "Very Good"
        | "Excellent"
}

export enum SEALType {
    Service = "Service",
    Enrichment = "Enrichment",
    Achievement = "Achievement",
    Leadership = "Leadership",
}

export interface SEALMembers {
    name: string
    admission_number: string
}

export interface SEALRecord {
    involvement: string
    points: number
    members: SEALMembers[]
    staff_id: string
    student_id: string
    attachment_key: string
    seal_id: string
    duration: string[]
    name: string
    type: SEALType
    award_details?: string
}

export interface SEALRecordAPI {
    message: string
    items: SEALRecord[]
    totalPoints: number
}
