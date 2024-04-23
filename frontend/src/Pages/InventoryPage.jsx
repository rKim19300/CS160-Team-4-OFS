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

    // async function onRemove(productId) {
    //     try {
    //         let product = await axiosInstance.get(`/api/getProductInfo/${productId}`);
    //         console.log(product);
    //         product.name;
    //         let response = await axiosInstance.post(`/api/updateProduct/${product.product_id}`, {
    //           product.name,
    //           product.price,
    //           weight,
    //           quantity,
    //           image_url: image,
    //           description,
    //           category_ids: selectedCategoryIds
    //         });
    //         if (response.status === 200) {
    //           console.log("Product info updated!");
    //           toast.success("Item updated successfully!");
    //         } else {
    //           toast.error(response.data);
    //         }
    //       } catch (err) {
    //         console.error(err);
    //         toast.error("Failed to update product!");
    //       }
    //     };
    //     useEffect();
    // }
    
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
                        if (product.quantity > -1) {
                        return (
                            <Tr>
                                <Td>{ product.product_id }</Td>
                                <Td>{ product.name }</Td>
                                <Td>${ product.price.toFixed(2) }</Td>
                                <Td>{ product.quantity }</Td>
                                <Td>{ product.weight }</Td>
                                <Td>
                                    <Link to={`/employee/changeProduct/${product.product_id}`}>
                                        <Button colorScheme="green">
                                            Edit
                                        </Button>
                                    </Link>
                                </Td>
                            </Tr>
                            )}
                        })}
                </Tbody>
            </Table>
        </TableContainer>
        <Link to={'/employee/addProduct'}>
        <Button colorScheme="green"  width="200px">
            Add Product
        </Button>
        </Link>
        <Heading align="left">Unavailable Products</Heading>
        <TableContainer>
            <Table variant='striped'>
                <TableCaption>Items Unavailable For Sale</TableCaption>
                <Thead>
                <Tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th>Price</Th>
                    <Th>Weight in lbs</Th>
                </Tr>
                </Thead>
                <Tbody>
                    {products.map(product => {
                        if (product.quantity < 0) {
                        return (
                            <Tr>
                                <Td>{ product.product_id }</Td>
                                <Td>{ product.name }</Td>
                                <Td>{ product.price }</Td>
                                <Td>{ product.weight }</Td>
                                <Td>
                                    <Button colorScheme="green" >
                                    <Link to={`/employee/changeProduct/${product.product_id}`}>
                                        Edit
                                    </Link>
                                    </Button>
                                </Td>
                            </Tr>
                            )}
                        })}
                </Tbody>
            </Table>
        </TableContainer>
        </Flex>
        </>
    )
}
