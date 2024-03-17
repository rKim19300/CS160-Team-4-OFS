import { Flex, Button } from "@chakra-ui/react";
import React from "react";
import axiosInstance from "../axiosInstance";

export default function SignOutButton() {
    return (
        <Button 
        colorScheme="red"
        onClick={
            async () => {
                try {
                    let response = await axiosInstance.get(`/api/logout`);
                    console.log(response);
                    if (response.status !== 200) 
                        return;
                } 
                catch (err) {
                    console.error(err);
                }
            }
        }
        >
            <a href="/">Sign Out</a>
        </Button>
    );
}