import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = ({ currentUser }) => {
    const location = useLocation();

    if (!currentUser) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }
    return <Outlet />;
};

export default ProtectedRoutes;
