import React, {useState, useEffect, useRef} from "react";
import axiosInstance from "../axiosInstance";
import NavBarCustomer from "../Components/NavBarCustomer";
import SideBarCustomer from "../Components/SideBarCustomer";
import {
    Flex,
    HStack,
    Text,
    Box,
    Button,
    Image,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    useBreakpointValue
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export default function ProductPage() {
    let { id } = useParams();
    const [productInfo, setProductInfo] = useState(null);
    const [errMsg, setErrMsg] = useState("");
    const quantityRef = useRef(1); // Ref to hold the quantity

    useEffect(() => {
        async function fetchData() {
            try {
                let response = await axiosInstance.get(`/api/productInfo/${id}`);
                console.log(response);
                let data = response.data;
                console.log(data);
                if (response.status !== 200) {
                    setErrMsg(data);
                    return;
                }
                setProductInfo(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, []);

    const addToCart = async () => {
        try {
            let response = await axiosInstance.post("/api/addItemToCart", {
                product_id: id,
                quantity: quantityRef.current.value // Access value using ref
            });
            let data = response.data;
            console.log(data);
            // TODO: do something to inform the user that the item was added to their cart
        } catch (err) {
            console.error(err);
        }
    };

    // there was an error fetching product info. Display the error message
    if (errMsg.length > 0) return <div>{errMsg}</div>;

    // this is here to make sure that the Page doesn't load until the necessary data is fetched from the backend
    // not really sure if this is the best way of doing it, but it works
    if (productInfo === null) return;

    return (
        <div>
            <NavBarCustomer />
            <Flex>
                <SideBarCustomer />
                <Flex flexDirection="column" alignItems="center" ml={{base: "80px", "2xl": "150px"}} p={{base: "20px", "2xl": "40px"}}>
                    <HStack spacing={{base: "90px", "2xl": "120px"}} justify="center">
                        <Box maxW="450px">
                            <Image src={productInfo.image_url} boxSize={{xl: "410px", "2xl": "450px"}} objectFit="cover" />
                            <Text mt="10px" fontSize="lg">{productInfo.description}</Text>
                        </Box>

                        <Box>
                            <Text fontSize="6xl">{productInfo.name}</Text>
                            <Text fontSize="4xl">${productInfo.price.toFixed(2)}</Text>
                            <Text fontSize="2xl">{productInfo.weight} lbs</Text>
                            <Text fontSize="lg" pt="5px" mt="3px">Quantity</Text>
                            <NumberInput size='lg' maxW="300px" defaultValue={1} min={1} max={productInfo.quantity}>
                                <NumberInputField ref={quantityRef} />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Button type="button" colorScheme="green" mt={3} width="300px" onClick={addToCart}>Add To Cart</Button>
                        </Box>
                    </HStack>
                </Flex>
            </Flex>
        </div>
    )
}
