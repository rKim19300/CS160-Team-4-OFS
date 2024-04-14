import React, {
    useState,
    useEffect 
  } from "react";
import { ChevronDownIcon } from '@chakra-ui/icons'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Heading,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Flex
  } from '@chakra-ui/react'  
import axiosInstance from "../axiosInstance";

export default function Orders() {
    // Hooks for Orders
    const [orders, setOrders] = useState(null);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
      async function fetchData() {
          try {
              let response = await axiosInstance.get(`/api/allOrders`);
              console.log(response);
              let data = response.data;
              console.log(data);
              if (response.status !== 200) {
                  setErrMsg(data);
                  return;
              }
              setOrders(data);
          } catch (err) {
              console.error(err);
          }
      }
      fetchData();
    }, []);
    
    // Make sure necessary data is fetched
    if (orders === null) 
      return <div>Loading. . .</div>;
    
    return (
        <>
        <Flex flexDirection="column" width="100%" padding="36px 16px">
        <Heading>Orders</Heading>
        <TableContainer>
            <Table variant='striped'>
                <Thead>
                <Tr>
                    <Th>Order Num</Th>
                    <Th>Customer Name</Th>
                    <Th>Date</Th>
                    <Th>Total</Th>
                    <Th>Action</Th>
                </Tr>
                </Thead>
                <Tbody>
                    {orders.map(order => {
                        return (
                            <Tr>
                                <Td>{ order.order_id }</Td>
                                <Td>{ order.user_id }</Td>
                                <Td>{ order.created_at }</Td>
                                <Td>${ order.cost.toFixed(2) }</Td>
                                <Td>
                                    <Menu>
                                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                        ...
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem>Refund</MenuItem>
                                        <MenuItem>Delete</MenuItem>
                                    </MenuList>
                                    </Menu>
                                </Td>
                            </Tr>
                            )})}
                </Tbody>
            </Table>
        </TableContainer>
        </Flex>
        </>
    )
}