import { AppShell, Text } from "@mantine/core"
import { useEffect } from "react"

import { Link, Route, Routes, useLocation } from "react-router-dom"
import useAppStore from "./app/Store"
import AppBar from "./components/AppBar"
import Nav from "./components/Nav"
import Authenticate from "./pages/Authenticate"
import Forbidden from "./pages/Forbidden"
import NotFound from "./pages/NotFound"
import Redirect from "./pages/Redirect"
import HomeStaff from "./pages/Staff/HomeStaff"
import LeaveStaff from "./pages/Staff/LeaveStaff"
import SealStaff from "./pages/Staff/SealStaff"
import StaffRoute from "./pages/StaffRoute"
import CalculatorStudent from "./pages/Student/CalculatorStudent"
import HomeStudent from "./pages/Student/HomeStudent"
import LeaveStudent from "./pages/Student/LeaveStudent"
import NewLeaveStudent from "./pages/Student/NewLeaveStudent"
import NewSealStudent from "./pages/Student/NewSealStudent"
import ResultsStudent from "./pages/Student/ResultsStudent"
import SealStudent from "./pages/Student/SealStudent"
import SubjectStudent from "./pages/Student/SubjectStudent"
import StudentRoute from "./pages/StudentRoute"
import { UserRole } from "./types/UserRole"

const App = () => {
    const location = useLocation()

    const user = useAppStore(state => state.userInfo)
    const setUser = useAppStore(state => state.setUser)

    const role = user?.role as UserRole

    useEffect(() => {
        if (!user && sessionStorage.getItem("userInfo")) {
            const userInfo = JSON.parse(sessionStorage.getItem("userInfo")!)
            const tokens = JSON.parse(sessionStorage.getItem("tokens")!)
            setUser(tokens, userInfo)
        }
    }, [user])

    console.log(role)

    return (
        <AppShell
            hidden={
                location.pathname === "/" ||
                location.pathname === "/login" ||
                location.pathname === "/logout"
            }
            navbar={<Nav type={role} />}
            header={<AppBar />}>
            <Routes>
                <Route path="/" element={<Authenticate />} />
                <Route
                    path="/login"
                    element={
                        <Redirect url="https://tposs-reimagined.auth.us-east-1.amazoncognito.com/login?client_id=4iermftj0fjo513022qtg0n464&response_type=code&scope=email+openid+phone+profile&redirect_uri=http://localhost:3000/" />
                    }
                />
                <Route
                    path="/logout"
                    element={
                        <Redirect url="https://tposs-reimagined.auth.us-east-1.amazoncognito.com/logout?client_id=4iermftj0fjo513022qtg0n464&logout_uri=https://tposs-reimagined.auth.us-east-1.amazoncognito.com/login?client_id=4iermftj0fjo513022qtg0n464&response_type=code&scope=email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F" />
                    }
                />
                <Route path="/staff" element={<StaffRoute role={role} />}>
                    <Route path="home" element={<HomeStaff />} />
                    <Route path="leave" element={<LeaveStaff />} />
                    <Route path="seal" element={<SealStaff />} />
                </Route>
                <Route path="/student" element={<StudentRoute role={role} />}>
                    <Route path="home" element={<HomeStudent />} />
                    <Route path="results" element={<ResultsStudent />} />
                    <Route path="leave" element={<LeaveStudent />} />
                    <Route
                        path="leave/new/:type"
                        element={<NewLeaveStudent isReadOnly={false} />}
                    />
                    <Route
                        path="leave/:id/:type"
                        element={<NewLeaveStudent isReadOnly />}
                    />
                    <Route path="seal" element={<SealStudent />} />
                    <Route
                        path="seal/new"
                        element={<NewSealStudent isReadOnly={false} />}
                    />
                    <Route
                        path="seal/:id"
                        element={<NewSealStudent isReadOnly />}
                    />
                    <Route path="subject" element={<SubjectStudent />} />
                    <Route path="calculator" element={<CalculatorStudent />} />
                </Route>
                <Route path="/forbidden" element={<Forbidden />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AppShell>
    )
}

export default App
