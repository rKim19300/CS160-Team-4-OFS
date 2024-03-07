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
    Input,
  } from '@chakra-ui/react'

/**
 * @returns The current inventory
 */
export default function Inventory() {
    return (
        <>
        <Heading align="left">All Products</Heading>
        <TableContainer>
            <Table variant='striped'>
                <TableCaption>Current item inventory </TableCaption>
                <Thead>
                <Tr>
                    <Th isNumeric>ID</Th>
                    <Th>Name</Th>
                    <Th>Price</Th>
                    <Th isNumeric>Quantity</Th>
                    <Th></Th>
                </Tr>
                </Thead>
                <Tbody>
                <Tr>
                    <Td isNumeric>1</Td>
                    <Td>Apple</Td>
                    <Td>$0.50</Td>
                    <Td isNumeric>3</Td>
                    <Td><u>Edit</u></Td>
                </Tr>
                <Tr>
                    <Td isNumeric>2</Td>
                    <Td>Apple Juice</Td>
                    <Td>$3.99</Td>
                    <Td isNumeric>200</Td>
                    <Td><u>Edit</u></Td>
                </Tr>
                <Tr>
                    <Td isNumeric>3</Td>
                    <Td>Banana</Td>
                    <Td>$0.75</Td>
                    <Td isNumeric>178</Td>
                    <Td><u>Edit</u></Td>
                </Tr>
                <Tr>
                    <Td isNumeric>42</Td>
                    <Td>Salmon Fillet</Td>
                    <Td>$5.00</Td>
                    <Td isNumeric>178</Td>
                    <Td><u>Edit</u></Td>
                </Tr>
                </Tbody>
            </Table>
        </TableContainer>
        </>
    )
}