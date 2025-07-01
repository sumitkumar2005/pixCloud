import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from '../pages/Register.jsx';
import Dashboard from '../pages/Dashboard';
import ProtectedRoutes from './ProtectedRoutes';
import Layout from '../components/Layout/Layout.jsx';
import Uploadform from "../pages/Uploadform.jsx";
import Myposts from "../pages/Myposts.jsx";
import Allpost  from "../pages/Allposts.jsx";
function AppRouter() {
    const { user, setUser, setToken,token } = useAuth();

    const routes = useMemo(() => (
        <Routes>
            <Route
                path="/login"
                element={
                    user ?
                    <Navigate to="/dashboard" replace /> :
                    <Register setUser={setUser} setToken={setToken} />
                }
            />

            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />

            <Route element={<ProtectedRoutes currentUser={user} />}>
                <Route element={<Layout currentUser={user} />}>
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/upload" element={<Uploadform user={user} token={token} />} />
                <Route path="/my-posts" element={<Myposts token={token}/>} />
                <Route path="/all-posts" element={<Allpost token={token} />} />
                </Route>
            </Route>
        </Routes>
    ), [user, setUser, setToken]);

    return (
        <BrowserRouter>
            {routes}
        </BrowserRouter>
    );
}

export default AppRouter;
