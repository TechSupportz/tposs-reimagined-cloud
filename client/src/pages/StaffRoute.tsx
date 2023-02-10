import { Navigate, Outlet } from "react-router-dom"
import { UserRole } from "../types/UserRole"

interface StaffRouteProps {
	role: UserRole
}

const StaffRoute = (props: StaffRouteProps) => {
    const isAuthenticated = true
    // const role: UserRole = "staff"

    if (!isAuthenticated) {
        return <Navigate to="/forbidden" />
    }

    if (props.role === "student") {
        return <Navigate to="/forbidden" />
    }

    return <Outlet />
}

export default StaffRoute
