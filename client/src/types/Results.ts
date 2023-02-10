export type SemesterType = "1.1" | "1.2" | "2.1" | "2.2" | "3.1" | "3.2"

export interface GradePointAverageAPI {
    message: string
    cgpa: number
    totalCredits: number
    totalGradedCredits: number
}

export interface ResultsAPI {
	message: string
	items: {
		results: SubjectResult[]
		student_id: string
		semester: SemesterType
	}
}

export interface SubjectResult {
	subject_name: string
	subject_code: string
	credit_units: number
	grade: "A" | "B+" | "B" | "C+" | "C" | "D+" | "D" | "F" | "PASS" | "FAIL"
}
