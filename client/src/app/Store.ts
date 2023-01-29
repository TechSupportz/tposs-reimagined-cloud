import { create} from "zustand"
import { AuthSlice, createAuthSlice } from "./Slices/AuthSlice"
import { createNavBarSlice, NavbarSlice } from "./Slices/NavbarSlice"

const useAppStore = create<NavbarSlice & AuthSlice>()((...args) => ({
    ...createNavBarSlice(...args),
    ...createAuthSlice(...args),
}))

export default useAppStore
