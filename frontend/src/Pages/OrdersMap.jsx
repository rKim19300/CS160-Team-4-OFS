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
    Button,
    Box,
    HStack,
    Spacer, 
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel, 
    Center,
    Text,
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogOverlay,
    useDisclosure
} from "@chakra-ui/react";
import styles from "./OrdersMap.module.css";
import { ArrowBackIcon } from "@chakra-ui/icons";

const metersToMilesConversion = 1609;
const socket = io.connect("http://localhost:8888");
//const socket = io.connect("http://localhost:8888/staff");

const ROBOT1_TAB = 'robot1';
const ROBOT2_TAB = 'robot2';
const ORDER_TAB = 'orders';

export default function OrdersMap() {

    // -- Constants --
    const containerStyle = {
        width: '100%',
        height: '400px',
    };

    // Hard coded SJSU ("store") address
    const store = { 
        lat: 37.33518596879412, 
        lng: -121.88107208071463
    };

    const robotPlaceHolder = {robot_id: -1};


    // -- Hooks --
    const [map, setMap] = useState( /** @type google.maps.Map */(null));

    const [robot1, setRobot1] = useState(store);
    const [robot2, setRobot2] = useState(store);
    const [currentRobot, setCurrentRobot] = useState(robotPlaceHolder);

    const [ center, setCenter ] = useState(store);

    const [ decodedPaths, setDecodedPaths ] = useState({robot1: [], robot2: []});
    const [orders, setOrders] = useState(null);
    const [ robot1Orders, setRobot1Orders ] = useState(null);
    const [ robot2Orders, setRobot2Orders ] = useState(null);

    // Flags to show certain content
    const [showRobot1, setShowRobot1] = useState(false);
    const [showRobot2, setShowRobot2] = useState(false);
    const [showOrders, setShowOrders] = useState(true);

    // For error messages
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();
    const [errMsg, setErrMsg] = useState("");

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyB4kJ8KLkJZ9C-E372tsLHyl29Ks-9jUmg"
    });


    // -- Data Calls --
    const sendRobot = async (robot_id) => {

        // Check on tab with robot
        if (robot_id < 0) {
            await setErrMsg("There is no robot to send out on this tab.");
            await onOpen();
            return;
        }

        let response = await axiosInstance.post('/api/sendRobot', {
            robot_id: robot_id
        });

        if (response.status !== 200) {
            setErrMsg(response.data);
            await onOpen();
            return;
        }
        setDecodedPaths(response.data);
    }

    // TODO Have this function update the polylines
    const fetchDecodedpaths = async () => {
        try {
            // TODO make it not return exit code 500 initially
            let response = await axiosInstance.get('/api/getDecodedPolylines');
            setDecodedPaths(response.data);
        }
        catch (err) {
            console.error(err);
        }
    };

    /**
     * Assumption: Assumes that there are two robots
     */
    const fetchRobots = async () => {
        try {
            let response = await axiosInstance.get('/api/getRobots');
            setRobot1(response.data[0]);
            setRobot2(response.data[1]);
        }
        catch (err) {
            console.error(err);
        }
    };

    const fetchOrders = async () => {
        try {
            let response = await axiosInstance.get('/api/unfinishedOrders');
            setOrders(response.data);
        }
        catch (err) {
            console.error(err);
        }
    };

    const fetchRobotOrders = async () => {
        try {
            console.log(`Robot 1 ID ${robot1.robot_id}`);
            let response1 = await axiosInstance.post('/api/getRobotOrders', {
                robot_id: robot1.robot_id
            });
            (response1.status !== 200) ?
                console.error("something went wrong when fetching robot1's orders") :
                setRobot1Orders(response1.data);

            let response2 = await axiosInstance.post('/api/getRobotOrders', {
                robot_id: robot2.robot_id
            });
            (response2.status !== 200) ?
               console.error("something went wrong when fetching robot2's orders") :
                setRobot2Orders(response2.data);
            console.log(robot1Orders);
            console.log(`Robot orders 2 ${robot2Orders}`);
        }
        catch (err) {
            console.error(err);
        }
    };
    

    // -- UseEffects --

    useEffect(() => {
        if (isLoaded) {
            fetchDecodedpaths();
            fetchOrders();
            fetchRobotOrders();
            fetchRobots();
        }
    }, [isLoaded]);

    useEffect(() => {
        fetchRobotOrders();
    }, [robot1, robot2]);

    useEffect(() => {
        socket.on('updatePolylines', (coord) => {
            fetchDecodedpaths();
        });
        socket.on('updateRobots', (coord) => {
            fetchRobots();
        });
        socket.on('updateOrders', (coords) => {
            fetchOrders();
            fetchRobotOrders();
        });

      }, [socket]);

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;
    

    // -- Map Content --
    const markerOptions = {
        // Set your custom icon URL here
        robot1: {
          url: '/robot1.png',
          scaledSize: new window.google.maps.Size(25, 25)
        },
        robot2: {
            url: '/robot2.png',
            scaledSize: new window.google.maps.Size(25, 25)
        }
      };
    
    const handleContent = async (tab) => {
        switch (tab) {
            case ROBOT1_TAB:
                setShowRobot1(true);
                setShowRobot2(false);
                setShowOrders(false);
                setCurrentRobot(robot1);
                break;
            case ROBOT2_TAB:
                setShowRobot1(false);
                setShowRobot2(true);
                setShowOrders(false);
                setCurrentRobot(robot2);
                break;
            case ORDER_TAB:
                setShowRobot1(false);
                setShowRobot2(false);
                setShowOrders(true);
                setCurrentRobot(robotPlaceHolder);
                break;
        }
    }

    function robot1Content() {
        return (
            <>
                {
                    /* Place the polylines on the map */
                    decodedPaths.robot1 && decodedPaths.robot1.map((path, idx) => (
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
                {
                    /* Place Robot1 orders on the map */
                    (robot1Orders !== null) && robot1Orders.map((order, idx) => (
                        <MarkerF 
                            key={idx + 'robot1'}
                            position={{lat: order.latitude, lng: order.longitude}}
                            title={`${order.order_id}`} 
                        />
                    ))
                }
                {
                <MarkerF 
                    position={{lat: robot1.latitude, lng: robot1.longitude}} 
                    icon={markerOptions.robot1} 
                    title={"Robot 1"}
                />
                }
            </>
        );
    }

    function robot2Content() {
        return (
            <>
                {
                    /* Place the polylines on the map */
                    decodedPaths.robot2 && decodedPaths.robot2.map((path, idx) => (
                        <PolylineF
                            key={idx + 'robot2'}
                            path={path}
                            options={{
                                strokeColor: '#FF0000',
                                strokeOpacity: 1,
                                strokeWeight: 2,
                            }}
                        />
                    ))
                }
                {
                    /* Place Robot2 orders on the map */
                    (robot2Orders !== null) && robot2Orders.map((order, idx) => (
                        <MarkerF 
                            key={idx}
                            position={{lat: order.latitude, lng: order.longitude}}
                            title={`${order.order_id}`} 
                        />
                    ))
                }
                <MarkerF 
                    position={{lat: robot2.latitude, lng: robot2.longitude}} 
                    icon={markerOptions.robot2} 
                    title={"Robot 2"}
                />
            </>
        );
    }

    function orderContent() {
        return (
            <>
                {
                    /* Place orders on the map */
                    orders && orders.map((order, idx) => (
                        <MarkerF 
                            key={idx}
                            position={{lat: order.latitude, lng: order.longitude}}
                            title={`${order.order_id}`} 
                        />
                    ))
                }
            </>
        );
    }

    // What the OrdersMap returns
    return (
        <>
            <Flex className={styles.container}>
                <Text className={styles.orderText}>
                    
                </Text>
            </Flex>
            <Flex marginLeft='100' className={styles.MapContainer}>
                <Box>
                    <Tabs>
                        <TabList>
                            <Tab 
                                onClick={() => {handleContent(ORDER_TAB)}}  
                            >
                                Show Orders
                            </Tab>
                            <Tab 
                                onClick={() => {handleContent(ROBOT1_TAB)}} 
                            >
                                Show Robot1
                            </Tab>
                            <Tab 
                                onClick={() => {handleContent(ROBOT2_TAB)}}  
                            >
                                Show Robot2
                            </Tab>
                        </TabList>
                    </Tabs>
                </Box>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                    onLoad={(map) => {setMap(map)}}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false
                    }}
                >   

                    {
                        showRobot1 && robot1Content()
                    }
                    {
                        showOrders && orderContent()
                    }
                    {
                        showRobot2 && robot2Content()
                    }
                    <MarkerF 
                        position={store} 
                        title={"Store"} 
                    />
                </GoogleMap>
                <br />
                <HStack justifyContent="space-between">
                    <Box>
                        <Button onClick={() => {sendRobot(currentRobot.robot_id)}} colorScheme="red">
                            Send Orders
                        </Button>
                    </Box>
                    <Spacer/>
                    <Box>
                        Go To:
                    </Box>
                    <Box>
                        <Button 
                            onClick={() => {
                                map.panTo(store);
                                setCenter(store);
                                }}>
                            Store
                        </Button>
                    </Box>
                    <Box>
                        <Button 
                            label={"Robot1"} 
                            onClick={() => {
                                map.panTo({lat: robot1.latitude, lng: robot1.longitude});
                                setCenter({lat: robot1.latitude, lng: robot1.longitude});
                                }}
                        >
                            Robot1
                        </Button>
                    </Box>  
                    <Box>
                        <Button 
                            onClick={() => {
                                map.panTo({lat: robot2.latitude, lng: robot2.longitude});
                                setCenter({lat: robot2.latitude, lng: robot2.longitude});
                                }}
                        >
                            Robot2
                        </Button>
                    </Box>
                </HStack>
            </Flex>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered={true} 
            >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    ERROR!
                    </AlertDialogHeader>

                    <AlertDialogBody>
                    {errMsg}
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button colorScheme='red' onClick={onClose} ml={3}>
                        Okay
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}
