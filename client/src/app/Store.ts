import { create} from "zustand"
import { AuthSlice, createAuthSlice } from "./Slices/AuthSlice"
import { createNavBarSlice, NavbarSlice } from "./Slices/NavbarSlice"
import { createSEALTabSlice, SEALTab } from "./Slices/TabSlice"

const useAppStore = create<NavbarSlice & AuthSlice & SEALTab>()((...args) => ({
    ...createNavBarSlice(...args),
    ...createAuthSlice(...args),
    ...createSEALTabSlice(...args),
}))

export default useAppStore
