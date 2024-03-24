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
  } from '@chakra-ui/react'
import axiosInstance from "../../axiosInstance";


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
                    {products.map(Object => {
                        return (
                            <tr>
                                <td>{ Object.product_id }</td>
                                <td>{ Object.name }</td>
                                <td>{ Object.price }</td>
                                <td>{ Object.quantity }</td>
                                <td>{ Object.weight }</td>
                                <Button colorScheme="green">
                                    <a href="/changeProduct">Edit</a>
                                </Button>
                            </tr>
                            )})}
                </Tbody>
            </Table>
        </TableContainer>
        </>
    )
}