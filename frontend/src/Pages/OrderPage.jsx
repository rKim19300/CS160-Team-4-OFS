import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { GoogleMap, useLoadScript, DirectionsRenderer } from '@react-google-maps/api';

import {
    Flex,
    Text,
    IconButton,
    FormControl,
    FormLabel,
    Input,
    Button,
} from "@chakra-ui/react";
import styles from "./OrderPage.module.css";
import { ArrowBackIcon } from "@chakra-ui/icons";



export default function OrderPage() {
    const containerStyle = {
        width: '100%',
        height: '600px',
    };

    const center = {
        lat: 37.41047,
        lng: -121.959257,
    };

    const [directions, setDirections] = useState(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyB4kJ8KLkJZ9C-E372tsLHyl29Ks-9jUmg"
    });

    const fetchDirections = (origin, destination, waypoints) => {
        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
            {
                origin: origin,
                destination: destination,
                waypoints: waypoints,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                } else {
                    console.error("Error fetching directions:", result.request);
                }
            }
        );
    };

    useEffect(() => {
        const origin = { lat: 37.3679163, lng: -121.9677333 };
        const destination = { lat: 37.4637866, lng: -122.172871 }; 
        const waypoints = [
            {
                location: { lat: 37.3621861, lng: -122.0598506 },
                stopover: true,
            },
        ];

        if (isLoaded) {
            fetchDirections(origin, destination, waypoints);
        }
    }, [isLoaded]);


    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <>
            <Flex className={styles.container}>
                <Text className={styles.orderText}>
                    Your order is on the way!
                </Text>
            </Flex>
            <Flex className={styles.MapContainer}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                >
                {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
            </Flex>
        </>

    );
}
