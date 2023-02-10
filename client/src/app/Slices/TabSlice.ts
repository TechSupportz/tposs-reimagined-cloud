import { StateCreator } from "zustand"
import { SemesterType } from "../../types/Results"
import { SEALPoint, SEALType } from "../../types/SEAL"

export interface SEALTab {
    selectedSEALType: SEALType | undefined
    setSEALSelectedType: (type: SEALType | undefined) => void
    selectedSemester: SemesterType | undefined
    setSelectedSemester: (semester: SemesterType | undefined) => void
}

export const createSEALTabSlice: StateCreator<SEALTab> = set => ({
    selectedSEALType: undefined,
    setSEALSelectedType: (type: SEALType | undefined) => {
        set({ selectedSEALType: type })
    },
    selectedSemester: undefined,
    setSelectedSemester: (semester: SemesterType | undefined) => {
        set({ selectedSemester: semester })
    },
})
