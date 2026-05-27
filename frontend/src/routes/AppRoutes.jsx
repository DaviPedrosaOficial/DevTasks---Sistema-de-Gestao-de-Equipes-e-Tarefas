import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Projects from "../pages/Projects";
import Tasks from "../pages/Tasks";

import PrivateRoute from "./PrivateRoute";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/projects/:id/tasks"
                    element={
                        <PrivateRoute>
                            <Tasks />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/projects"
                    element={
                        <PrivateRoute>
                            <Projects />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;