import { create} from "zustand"
import { createNavBarSlice, NavbarSlice } from "./Slices/NavbarSlice"

const useAppStore = create<NavbarSlice>()((...args) => ({
    ...createNavBarSlice(...args),
}))

export default useAppStore
