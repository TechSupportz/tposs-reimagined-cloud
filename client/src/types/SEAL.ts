export interface SEALPoint {
    message: string
    studentId: string
    points: number
    grade: "Did not participate" | "Participated" | "Good" | "Very Good" | "Excellent"
}