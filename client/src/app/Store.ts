import { create} from "zustand"
import { AuthSlice, createAuthSlice } from "./Slices/AuthSlice"
import { CalculatorSlice, createCalculatorSlice } from "./Slices/CalculatorSlice"
import { createNavBarSlice, NavbarSlice } from "./Slices/NavbarSlice"
import { createSEALTabSlice, SEALTab } from "./Slices/TabSlice"

const useAppStore = create<NavbarSlice & AuthSlice & SEALTab & CalculatorSlice>()((...args) => ({
    ...createNavBarSlice(...args),
    ...createAuthSlice(...args),
    ...createSEALTabSlice(...args),
    ...createCalculatorSlice(...args)
}))

export default useAppStore
