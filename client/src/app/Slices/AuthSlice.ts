import { DateTime } from "luxon"
import { StateCreator } from "zustand"
import { UserRole } from "../../types/UserRole"

export interface AuthTokens {
    access_token: string | null
    expires_in: number | null
    id_token: string | null
    refresh_token: string | null
    token_type: string | null
}

export interface StudentInfo {
    name: string
    username: string
    role: UserRole
    school: string
    course: string
    year: number
    carePersonId: string
    phoneNumber: string
}

export interface StaffInfo {
    name: string
    username: string
    role: UserRole
    school: string
    phoneNumber: string
}

export interface AuthSlice {
    tokens: AuthTokens
    userInfo: StudentInfo | StaffInfo | null
    currentSemester: 1 | 2
    setUser: (tokens: AuthTokens, user: StudentInfo | StaffInfo) => void
    clearUser: () => void
}

export const createAuthSlice: StateCreator<AuthSlice> = set => ({
    tokens: {
        access_token: null,
        expires_in: null,
        id_token: null,
        refresh_token: null,
        token_type: null,
    },

    userInfo: null,

    currentSemester:
        DateTime.now().month >= 10 || DateTime.now().month <= 3 ? 2 : 1,

    setUser: (tokens: AuthTokens, user: StudentInfo | StaffInfo) => {
        set({
            tokens: tokens,
            userInfo: { ...user, username: user.username.toUpperCase() },
        })
        sessionStorage.setItem("tokens", JSON.stringify(tokens))
        sessionStorage.setItem("userInfo", JSON.stringify(user))
        console.table(tokens)
    },

    clearUser: () => {
        set({
            tokens: {
                access_token: null,
                expires_in: null,
                id_token: null,
                refresh_token: null,
                token_type: null,
            },
            userInfo: null,
        })
        sessionStorage.clear()
    },
})
