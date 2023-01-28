import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UserRole } from '../types/UserRole'

interface StudentRouteProps {
    role: UserRole
}

const StudentRoute = (props: StudentRouteProps) => {
  const isAuthenticated = true
  // const role: UserRole = "staff"

  if (!isAuthenticated) {
      return <Navigate to="/forbidden" />
  }

  if (props.role === "staff") {
      return <Navigate to="/forbidden" />
  }

  return <Outlet />
}

export default StudentRoute