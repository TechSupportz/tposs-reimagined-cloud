import { StateCreator } from "zustand"

export interface CalculatorSubjects {
    subject_code: string
    subject_name: string
    credit_units: number
    graded: boolean
    grade: string
}

export interface CalculatorSlice {
    newCreditUnits: number
    newGradedCreditUnits: number
    subjects: CalculatorSubjects[]

    setNewCreditUnits: (newCreditUnits: number) => void
    setNewGradedCreditUnits: (newGradedCreditUnits: number) => void
    setSubjects: (subjects: CalculatorSubjects[]) => void
    updateSubjects: (subject: CalculatorSubjects[]) => void
}

export const createCalculatorSlice: StateCreator<CalculatorSlice> = set => ({
    newCreditUnits: 0,
    newGradedCreditUnits: 0,
    subjects: [],

    setNewCreditUnits: (creditUnits: number) => {
        set({ newCreditUnits: creditUnits })
    },
    setNewGradedCreditUnits: (gradedCreditUnits: number) => {
        set({ newGradedCreditUnits: gradedCreditUnits })
    },
    setSubjects: (subjects: CalculatorSubjects[]) => {
        set({ subjects: subjects })
    },
    updateSubjects: (newSubjects: CalculatorSubjects[]) => {
        set({ subjects: newSubjects })
    },
})
