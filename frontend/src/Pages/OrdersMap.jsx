import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { GoogleMap, useLoadScript, DirectionsRenderer, MarkerF } from '@react-google-maps/api';

import {
    Flex,
    Text,
    IconButton,
    FormControl,
    FormLabel,
    Input,
    Button,
    Box,
    HStack,
    Spacer
} from "@chakra-ui/react";
import styles from "./OrdersMap.module.css";
import { ArrowBackIcon } from "@chakra-ui/icons";

const metersToMilesConversion = 1609;

export default function OrdersMap() {
    const containerStyle = {
        width: '100%',
        height: '475px',
    };

    // Hard coded SJSU ("store") address
    const store = { 
        lat: 37.33518596879412, 
        lng: -121.88107208071463
    };
    const [robot1, setRobot1] = useState({lat: 37.320353656705855, lng: -121.87615293846709});
    const [robot2, setRobot2] = useState({lat: 37.32285106535895, lng: -121.89976185528579});

    const [map, setMap] = useState( /** @type google.maps.Map */(null));

    const [directions, setDirections] = useState(null);

    // Of the whole route
    const [distance, setDistance] = useState(0); // In miles
    const [duration, setDuration] = useState(0); // In Seconds 

    const [addressValid, setAddressValid] = useState(0); 

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyB4kJ8KLkJZ9C-E372tsLHyl29Ks-9jUmg"

    });

    const validateAddress = async () => {
        try{
            let response = await axiosInstance.post("/api/validateAddress", {
                address: '1 Washion Sq',
                city: 'San Jose',
                state: 'CA',
                zipCode: '95192'
            });
            let data = response.data;
            if (response.status !== 200) {
                console.error("Something went wrong");
                return;
            }
            setAddressValid(data);
            console.log(data);
        }
        catch (err) {
            console.error(err);
        }
    }

    // Calculate the Distance of the route
    // TODO move the direction generation to the backend
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
                    // Calc the total distance of the route and then set hooks
                    let totalDistance = 0;
                    let totalDuration = 0;
                    result.routes[0].legs.forEach((leg) => {
                        totalDistance += leg.distance.value / metersToMilesConversion;
                    })
                    result.routes[0].legs.forEach((leg) => {
                        totalDuration += leg.duration.value;
                    })
                    
                    setDirections(result);
                    setDistance(totalDistance);
                    setDuration(totalDuration);
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
            validateAddress();
        }
    }, [isLoaded]);

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <>
            <Flex className={styles.container}>
                <Text className={styles.orderText}>
                    
                </Text>
            </Flex>
            <Flex className={styles.MapContainer}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={store}
                    zoom={10}
                    onLoad={(map) => {setMap(map)}}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false
                    }}
                >
                    <MarkerF position={store}/>
                    <MarkerF position={robot1}/>
                    <MarkerF position={robot2}/>
                    {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
                <br />
                <HStack justifyContent="space-between">
                    <Box>
                        <Button colorScheme="red">
                            Send Orders
                        </Button>
                    </Box>
                    <Spacer/>
                    <Box>
                        <Button onClick={() => {map.panTo(store)}}>
                            Store
                        </Button>
                    </Box>
                    <Box>
                        <Button label={"Robot1"} onClick={() => {map.panTo(robot1)}}>
                            Robot1
                        </Button>
                    </Box>
                    <Box>
                        <Button onClick={() => {map.panTo(robot2)}}>
                            Robot2
                        </Button>
                    </Box>
                </HStack>
            </Flex>
        </>
    );
}
