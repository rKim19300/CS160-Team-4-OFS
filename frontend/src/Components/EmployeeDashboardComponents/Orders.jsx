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
                    <Th isNumeric>Order Num</Th>
                    <Th>Customer Name</Th>
                    <Th>Date</Th>
                    <Th>Total</Th>
                    <Th>Status</Th>
                    <Th>Action</Th>
                </Tr>
                </Thead>
                <Tbody>
                <Tr>
                    <Td isNumeric>1111</Td>
                    <Td>John Doe</Td>
                    <Td>March 5 2024</Td>
                    <Td>$10.87</Td>
                    <Td>Out for delivery</Td>
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
                <Tr>
                    <Td isNumeric>1112</Td>
                    <Td>Jane Doe</Td>
                    <Td>March 5 2024</Td>
                    <Td>$23.01</Td>
                    <Td>Delivered</Td>
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
                <Tr>
                    <Td isNumeric>1113</Td>
                    <Td>Johnathan Doe</Td>
                    <Td>February 30 2024</Td>
                    <Td>$3.21</Td>
                    <Td>Unfulfilled</Td>
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
                </Tbody>
            </Table>
        </TableContainer>
        </>
    )
}