export interface SubjectBySemesterAPI {
    message: string
    items: {
        subjects: Subject[]
        course: string
        cohort: string
    }
}

export interface Subject {
    subject_name: string
    subject_code: string
    credit_units: number
}
