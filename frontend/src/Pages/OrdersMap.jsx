import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import io from "socket.io-client";
import { 
    GoogleMap, 
    useLoadScript,
    DirectionsRenderer,
    MarkerF,
    PolylineF
} from '@react-google-maps/api';
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
const socket = io.connect("http://localhost:8888");
//const staffSocket = io.connect("http://localhost:8888/staff");

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
    const [robot1, setRobot1] = useState(store);
    const [robot2, setRobot2] = useState(store);

    const [map, setMap] = useState( /** @type google.maps.Map */(null));

    const [directions, setDirections] = useState(null);
    const [ decodedPath, setDecodedPath ] = useState(null);
    const [ decodedPaths, setDecodedPaths ] = useState(null);

    // Of the whole route
    const [distance, setDistance] = useState(0); // In miles
    const [duration, setDuration] = useState(0); // In Seconds 

    const [addressValid, setAddressValid] = useState(0); 

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyB4kJ8KLkJZ9C-E372tsLHyl29Ks-9jUmg"
    });

    const sendRobot = async () => {
        let response = await axiosInstance.get('/api/sendRobot');
        if (response.status !== 200) {
            console.error("Something went wrong when sending robot");
            return;
        }
        setDecodedPaths(response.data);
    }

    // Calculate the Distance of the route
    // TODO move the direction generation to the backend
    const fetchDirections = async () => {
        try {
            /*let response = await axiosInstance.get("/api/generateRouteData"); 
            if (response.status !== 200) {
                console.error("Something went wrong");
                return;
            }
            
            setDirections(response.data);
            response = await axiosInstance.post("/api/decodePolyline", {
                encodedPolyline: response.data.routes[0].polyline.encodedPolyline
            });
            setDecodedPath(response.data);*/
        }
        catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (isLoaded) {
            fetchDirections();
            //validateAddress();
            /*socket.on("recieve_message", (message) => {
                console.log(message);
            });*/
        }
    }, [isLoaded]);

    useEffect(() => {
        socket.on('updateRobot1', (coord) => {
            setRobot1(coord);
        });
      }, [socket]);

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    const markerOptions = {
        // Set your custom icon URL here
        robot1: {
          url: '/robot1.png',
          scaledSize: new window.google.maps.Size(25, 25) // Adjust the size as needed
        },
        robot2: {
            url: '/robot2.png',
            scaledSize: new window.google.maps.Size(25, 25) // Adjust the size as needed
          }
      };

    console.log(directions);
    console.log(decodedPaths);

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
                    {
                        
                        decodedPaths && decodedPaths.map((path, idx) => (
                            <PolylineF
                                key={idx}
                                path={path}
                                options={{
                                    strokeColor: '#FF0000',
                                    strokeOpacity: 1,
                                    strokeWeight: 2,
                                }}
                            />
                        ))
                    }
                    <MarkerF position={store} title={"Store"} />
                    <MarkerF 
                        position={robot1} 
                        icon={markerOptions.robot1} 
                        title={"Robot 1"}
                    />
                    <MarkerF 
                        position={robot2} 
                        icon={markerOptions.robot2} 
                        title={"Robot 2"}
                    />
                    {/*directions && <DirectionsRenderer directions={directions} />*/}
                </GoogleMap>
                <br />
                <HStack justifyContent="space-between">
                    <Box>
                        <Button onClick={sendRobot} colorScheme="red">
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
