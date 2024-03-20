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
  } from '@chakra-ui/react'  
import axiosInstance from "../../axiosInstance";

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
                    {orders.map(Object => {
                        return (
                            <tr>
                                <td>{ Object.order_id }</td>
                                <td>{ Object.user_id }</td>
                                <td>{ Object.created_at }</td>
                                <td>{ Object.cost }</td>
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
                            </tr>
                            )})}
                </Tbody>
            </Table>
        </TableContainer>
        </>
    )
}