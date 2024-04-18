import React, {
    useState,
    useEffect 
  } from "react";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Heading,
    Button,
    Text,
    Flex
  } from '@chakra-ui/react'
import axiosInstance from "../axiosInstance";
import { Link } from "react-router-dom";


export default function Inventory() {

    // Hooks for Products
    const [products, setProducts] = useState(null);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
      async function fetchData() {
          try {
              let response = await axiosInstance.get(`/api/allProducts`);
              console.log(response);
              let data = response.data;
              console.log(data);
              if (response.status !== 200) {
                  setErrMsg(data);
                  return;
              }
              setProducts(data);
          } catch (err) {
              console.error(err);
          }
      }
      fetchData();
    }, []);
    
    // Make sure necessary data is fetched
    if (products === null) 
      return <div>Loading. . .</div>;
    
    return (
        <>
        <Flex flexDirection="column" width="100%" padding="36px 16px">
        <Heading align="left">All Products</Heading>
        <TableContainer>
            <Table variant='striped'>
                <TableCaption>Current item inventory </TableCaption>
                <Thead>
                <Tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th>Price</Th>
                    <Th>Quantity</Th>
                    <Th>Weight in lbs</Th>
                </Tr>
                </Thead>
                <Tbody>
                    {products.map(product => {
                        return (
                            <Tr>
                                <Td>{ product.product_id }</Td>
                                <Td>{ product.name }</Td>
                                <Td>${ product.price.toFixed(2) }</Td>
                                <Td>{ product.quantity }</Td>
                                <Td>{ product.weight }</Td>
                                <Td>
                                    <Link to={`/employee/changeProduct/${product.product_id}`}>
                                        <u>Edit</u>
                                    </Link>
                                </Td>
                            </Tr>
                            )})}
                </Tbody>
            </Table>
        </TableContainer>
        <Link to={'/employee/addProduct'}>
        <Button colorScheme="green"  width="200px">
            Add Product
        </Button>
        </Link>
        </Flex>
        </>
    )
}
