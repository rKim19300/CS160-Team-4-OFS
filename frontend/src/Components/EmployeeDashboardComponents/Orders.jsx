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

/**
 * @returns order history
 */
export default function Orders() {
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