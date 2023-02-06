import { StateCreator } from "zustand"
import { SEALPoint, SEALType } from "../../types/SEAL"

export interface SEALTab {
    selectedType: SEALType | undefined
    setSelectedType: (type: SEALType | undefined) => void
}

export const createSEALTabSlice: StateCreator<SEALTab> = set => ({
    selectedType: undefined,
    setSelectedType: (type: SEALType | undefined) => {
        set({ selectedType: type })
    },
})
