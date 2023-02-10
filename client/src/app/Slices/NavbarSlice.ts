import { StateCreator } from "zustand"

export interface NavbarSlice {
    isNavbarOpen: boolean
    toggleNavbar: () => void
}

export const createNavBarSlice: StateCreator<NavbarSlice> = set => ({
    isNavbarOpen: false,
    toggleNavbar: () => {
        set(state => ({ isNavbarOpen: !state.isNavbarOpen }))
        // console.log("toggled navbar")
    },
})

