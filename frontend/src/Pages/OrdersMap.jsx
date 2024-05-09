import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import io from "socket.io-client";
import { 
    GoogleMap, 
    useLoadScript,
    DirectionsRenderer,
    MarkerF,
    PolylineF,
    InfoWindowF
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
    useDisclosure,
    Table,
    TableCaption,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from "@chakra-ui/react";
import styles from "./OrdersMap.module.css";
import { ArrowBackIcon } from "@chakra-ui/icons";

const metersToMilesConversion = 1609;
const socket = io.connect("http://localhost:8888");
//const socket = io.connect("http://localhost:8888/staff");

const ROBOT1_TAB = 'robot1';
const ROBOT2_TAB = 'robot2';
const ORDER_TAB = 'orders';

const NUM_TO_STATUS = {
    0: "Processing",
    1: "En Route",
    2: "Delivered"
}

export default function OrdersMap() {

    // -- Constants --
    const containerStyle = {
        width: '100%',
        // height: '400px',
        height: 'max(51vh, 400px)',
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

    // Holds the order_id of the currently open marker window (each marker represents an order)
    const [openMarkerWindow, setOpenMarkerWindow] = useState(-1); 

    // For error messages
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();
    const [errMsg, setErrMsg] = useState("");

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyB4kJ8KLkJZ9C-E372tsLHyl29Ks-9jUmg"
    });


    // -- Data Calls --
    const sendRobot = async (robot_id) => {
        try {
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

            // Update orders info so that the order status update can be seen on the `Show Orders` tab
            await fetchOrders();
        }
        catch (err) {
            setErrMsg(`Something went wrong on our end, please try again in 60 seconds. 
                        If this issue persists after a few tries, please call tech support
                        at 098-765-4321.`);
            await onOpen();
        }
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
        // When we switch tabs (Shows Orders, Show Robot1, Show Robot2), close marker window if any is open
        if (openMarkerWindow !== -1) setOpenMarkerWindow(-1);
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
                    plotMarkers(robot1Orders)
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
                    plotMarkers(robot2Orders)
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
        // plot all pending orders (Show Orders tab) on the map
        return plotMarkers(orders);
    }

    // Helper function to plot list of orders on map
    function plotMarkers(specifiedOrders) {
        return (
            <>
                {
                    /* Place orders on the map */
                    specifiedOrders && specifiedOrders.map((order, idx) => (
                        <MarkerF 
                            key={idx}
                            position={{lat: order.latitude, lng: order.longitude}}
                            title={`${order.order_id}`} 
                            label={`${order.order_id}`} 
                            onClick={() => setOpenMarkerWindow(order.order_id)}
                        >
                            {openMarkerWindow === order.order_id && 
                              <InfoWindowF 
                                onCloseClick={() => setOpenMarkerWindow(-1)}
                                position={{lat: order.latitude, lng: order.longitude}}
                              >
                                <div>
                                    <span>OrderID: {order.order_id}</span>
                                    <br />
                                    <span>Status: {NUM_TO_STATUS[order.status]}</span>
                                    <br />
                                    <span>Weight: {order.weight.toFixed(2)} lbs</span>
                                    <br />
                                    <span>Cost: ${order.cost.toFixed(2)}</span>
                                </div>
                              </InfoWindowF>
                            }
                        </MarkerF>
                    ))
                }
            </>
        );
    }


    function displayOrdersInfoTable(tableCaption, specifiedOrders) {
        return (
            <>
                <TableContainer mt='50px' mx="auto" width="87%" mb={10} whiteSpace="normal">
                    <Table variant='striped'>
                        <TableCaption>{tableCaption}</TableCaption>
                        <Thead>
                        <Tr>
                            <Th>Order ID</Th>
                            <Th>Cost</Th>
                            <Th>Weight (lbs)</Th>
                            <Th>Address</Th>
                            <Th>Status</Th>
                            <Th>Placed On</Th>
                        </Tr>
                        </Thead>
                        <Tbody>
                            {specifiedOrders && specifiedOrders.map((order, idx) => {
                                return (
                                    <Tr key={idx}>
                                        <Td>{ order.order_id }</Td>
                                        <Td>${ order.cost.toFixed(2) }</Td>
                                        <Td>{ order.weight.toFixed(2) }</Td>
                                        <Td>{ order.address }</Td>
                                        <Td>{ NUM_TO_STATUS[order.status] }</Td>
                                        <Td>{ order.created_at }</Td>
                                    </Tr>
                                    )
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
                    
            </>
        )
    }

    // What the OrdersMap returns
    return (
        <>
            <Box w='100%'>
                {showRobot1 ? (
                    <Text p='20px 0px' className={styles.orderText}>Robot1 Orders</Text>
                ) : showRobot2 ? (
                    <Text p='20px 0px' className={styles.orderText}>Robot2 Orders</Text>
                ) : showOrders ? (
                    <Text p='20px 0px' className={styles.orderText}>Pending Orders</Text>
                ) : (
                    <Text>Not Found</Text>
                )}
                <Flex className={styles.MapContainer}>
                    <Box>
                        <Tabs isLazy={true}>
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
                        {showRobot1 && robot1Content()}
                        {showOrders && orderContent()}
                        {showRobot2 && robot2Content()}
                        <MarkerF 
                            position={store} 
                            title={"Store"} 
                            label="S"
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
                            Pan To:
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
                        {/* Make sure it is not on the orders tab */
                        currentRobot.robot_id !== -1 && 
                        <Box>
                            <Button 
                                label={"Robot"} 
                                onClick={() => {
                                    if (currentRobot.robot_id === robot1.robot_id) {
                                        map.panTo({lat: robot1.latitude, lng: robot1.longitude});
                                        setCenter({lat: robot1.latitude, lng: robot1.longitude});
                                    }
                                    else if (currentRobot.robot_id === robot2.robot_id) {
                                        map.panTo({lat: robot2.latitude, lng: robot2.longitude});
                                        setCenter({lat: robot2.latitude, lng: robot2.longitude});
                                    }
                                    }}
                            >
                                Robot
                            </Button>
                        </Box>}
                    </HStack>
                </Flex>

                {showRobot1 && displayOrdersInfoTable("Robot1 Orders", robot1Orders)}
                {showOrders && displayOrdersInfoTable("Pending Orders", orders)}
                {showRobot2 && displayOrdersInfoTable("Robot2 Orders", robot2Orders)}
            </Box>

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
