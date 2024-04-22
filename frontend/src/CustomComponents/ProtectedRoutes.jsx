import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from 'react-router-dom'
import axiosInstance from "../axiosInstance";
import { UserType } from "../Enums/enums";

export default function PrivateRoutes({ isStaff }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchData() {
            let res = await axiosInstance.get("/api/viewUser");
            let data = res.data;
            if (res.status !== 200) {
                setUser({ errMsg: data });
                return;
            }
            setUser(data);
        }
        fetchData();
    }, []);

    if (user === null) {
        return;
    }

    if (isStaff === false) {
        // as long as the user is logged in, we let them access the page
        return user.user_id ? <Outlet/> : <Navigate to='/'/>;
    } else {
        // user needs to be employee to view page
        // if they are a customer, redirect to /customer route
        // if they are not logged in, redirect to login page
        if (user.user_type >= UserType.EMPLOYEE) return <Outlet />;
        if (user.user_type === UserType.CUSTOMER) return <Navigate to='/customer'/>;
        return <Navigate to="/login"/>;
    }
}
