import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

/**
 * @returns The userType of the user visiting the page
 */
export default function useUserType() {

    const [userType, setUserType] = useState(0);

    async function getUserType() {
        try {
            let response = await axiosInstance.get(`/api/getUserType`);
            let { message, userType } = response.data;
            setUserType(userType);
        }
        catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        getUserType();
      }, []);

    return userType;
}
