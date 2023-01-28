import { create, StateCreator } from "zustand"

interface NavbarSlice {
    isOpen: boolean
    toggleNavbar: () => void
}

const createNavBarSlice: StateCreator<NavbarSlice> = set => ({
    isOpen: true,
    toggleNavbar: () => {
        set(state => ({ isOpen: !state.isOpen }))
        console.log("toggled navbar")
    },
})

const useAppStore = create<NavbarSlice>()((...args) => ({
    ...createNavBarSlice(...args),
}))

export default useAppStore
