import { AppShell, Text } from "@mantine/core"

import { Route, Routes } from "react-router-dom"
import AppBar from "./components/AppBar"
import Nav from "./components/Nav"
import Forbidden from "./pages/Forbidden"
import NotFound from "./pages/NotFound"
import HomeStaff from "./pages/Staff/HomeStaff"
import LeaveStaff from "./pages/Staff/LeaveStaff"
import SealStaff from "./pages/Staff/SealStaff"
import StaffRoute from "./pages/StaffRoute"
import CalculatorStudent from "./pages/Student/CalculatorStudent"
import HomeStudent from "./pages/Student/HomeStudent"
import LeaveStudent from "./pages/Student/LeaveStudent"
import ResultsStudent from "./pages/Student/ResultsStudent"
import SealStudent from "./pages/Student/SealStudent"
import SubjectStudent from "./pages/Student/SubjectStudent"
import StudentRoute from "./pages/StudentRoute"
import { UserRole } from "./types/UserRole"

const App = () => {
    const role: UserRole = "student"

    return (
        <AppShell navbar={<Nav type={role} />} header={<AppBar />}>
            <Routes>
                <Route path="/" element={<HomeStudent />} />
                <Route path="/staff" element={<StaffRoute role={role} />}>
                    <Route path="/staff/home" element={<HomeStaff />} />
                    <Route path="/staff/leave" element={<LeaveStaff />} />
                    <Route path="/staff/seal" element={<SealStaff />} />
                </Route>
                <Route path="/student" element={<StudentRoute role={role} />}>
                    <Route path="/student/home" element={<HomeStudent />} />
                    <Route
                        path="/student/results"
                        element={<ResultsStudent />}
                    />
                    <Route path="/student/leave" element={<LeaveStudent />} />
                    <Route path="/student/seal" element={<SealStudent />} />
                    <Route
                        path="/student/subject"
                        element={<SubjectStudent />}
                    />
                    <Route
                        path="/student/calculator"
                        element={<CalculatorStudent />}
                    />
                </Route>
                <Route path="/forbidden" element={<Forbidden />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AppShell>
    )
}

export default App
