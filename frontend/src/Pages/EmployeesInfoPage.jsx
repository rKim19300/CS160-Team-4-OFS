import React, {
  useState,
  useEffect,
  useRef
} from "react";
import {
    Heading,
    Divider,
    Box,
    Flex,
    IconButton,
    Card, 
    CardHeader, 
    CardBody, 
    CardFooter,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    useDisclosure,
    AlertDialogOverlay,
    Center,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton
} from "@chakra-ui/react";
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons'
import FadeInGrid from "../CustomComponents/FadeInGrid"
import axiosInstance from "../axiosInstance";
import SignUpPage from "./SignUpPage";


export default function Employees() {

    const { 
      isOpen: isRegisterOpen, 
      onOpen: onRegisterOpen, 
      onClose: onRegisterClose } = useDisclosure();
    const cancelRegisterRef = React.useRef();

    // Hooks for Employees
    const [employees, setEmployees] = useState(null);
    const [errMsg, setErrMsg] = useState("");

    // Hooks to rerender the FadeInGrid
    const [seed, setSeed] = useState(1);
    const reset = () => {
         setSeed(Math.random());
    }

    // Function that fetches employee data
    async function fetchData() {
      try {
          let response = await axiosInstance.get(`/api/employees`);
          console.log(response);
          let data = response.data;
          console.log(data);
          if (response.status !== 200) {
              setErrMsg(data);
              return;
          }
          setEmployees(data);
      } catch (err) {
          console.error(err);
      }
    }

    // Fetch employee data upon entering page
    useEffect(() => {
      try {
        fetchData();
      }
      catch (err) {
        console.error(err);
      }
    }, []);

    // Error for monthRevenue
    if (errMsg.length > 0) 
    return <div>{errMsg}</div>;

    // Make sure necessary data is fetched
    if (employees === null) 
      return <div>Loading. . .</div>;

    return (
      <Flex>
        <Box width="170vh">
          <Flex alignContent={"center"} justifyContent={"center"}>
            <Heading>Employees</Heading>
          </Flex>
          <br />
          <Flex alignContent={"center"} justifyContent={"center"}>
            {/* Open a model when adding an employee */}
          <IconButton
              colorScheme='green'
              aria-label='Call Segun'
              size='lg'
              icon={<AddIcon />}
              onClick={onRegisterOpen}
            />
          </Flex>
          <br />
          <Divider size="10x"/>
          <br />
          <Flex alignContent={"center"} justifyContent={"center"}>
            <FadeInGrid columns={4} spacing={10} delay={50} key={seed}>
            {employees.map((employee, idx) => (
              <EmployeeGridCard 
                key={idx} 
                employee={employee} 
                fetchData={fetchData} 
                reset={reset} 
              />
            ))}
            </FadeInGrid>
          </Flex>
            {/* Modal for employee sign-up */}
            <Modal 
              isOpen={isRegisterOpen} 
              onClose={onRegisterClose} 
              isCentered={true}
              finalFocusRefRef={cancelRegisterRef}
            >
              <ModalOverlay backdropFilter="blur(8px)"/>
              <ModalContent 
                maxWidth="140vh" 
                maxHeight="70vh" 
                overflowY="auto" 
                overflowX="auto"
              >
                {/* modal for Employee sign-up */}
                <ModalBody>
                  <Box>
                    <SignUpPage
                      createEmployee={true} 
                      onSignUpSuccess={
                        async () => {
                          await fetchData();
                          await onRegisterClose();
                          await reset();
                        }}
                    />
                  </Box>
                </ModalBody>
              </ModalContent>
            </Modal>
        </Box>
      </Flex>
    );
}

/**
 * 
 * @param {*} employee   The employee data queried from the database
 * @param {*} fetchData  Function to refresh the employee data
 * @param {*} reset      Function to refresh the fade-in grid 
 * @returns              A card displaying employee name, email, and ID
 */
function EmployeeGridCard({ employee, fetchData, reset }) {

  // Hooks for the deletion employee pop-up
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelDeleteRef = useRef();

  return (
    <Flex>
      {/* Card which holds employee information */}
      <Card border='3px solid grey' width='180px' height='100px'>
        <Box flex='1'>
          <CardHeader 
            fontWeight='bold' 
            textAlign='center' 
            fontSize="medium" 
            padding='1px' 
            margin='5px'
            overflow='hidden'
          >
            {employee.username}
          </CardHeader>
        </Box>
        <Box>
        </Box>
        <CardBody textAlign='center' fontSize="small" padding='1px' margin='5px' overflow='hidden'>
          {employee.email}
        </CardBody>
        <CardFooter padding='1px' fontSize="x-small" color='grey' margin='5px'>
          ID #{employee.user_id}
          <Box position='absolute' right='2px'>
            {/* Dropdown menu */}
            <Menu alignContent='center'>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} width='0px' height='0px'/>
              <MenuList>
                <MenuItem onClick={onDeleteOpen} fontSize="small" color='red.500'>
                  Remove
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </CardFooter>
      </Card>
      {/* Alert dialogue for employee deletion */}
      <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelDeleteRef}
          onClose={onDeleteClose}
          isCentered={true}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete Employee
              </AlertDialogHeader>
              <AlertDialogBody>
                <Center>
                  Are you sure you want to delete?
                </Center> <br/> 
                <b>Name:</b> {employee.username} <br/>
                <b>ID:</b> #{employee.user_id} <br />
              </AlertDialogBody>
              <AlertDialogFooter>
                  <Button colorScheme='red' onClick={
                    async () => {
                      try {
                        let response = await axiosInstance.post(`/api/removeEmployee`, {
                          user_id: employee.user_id
                        });
                        console.log(response);
                        if (response.status !== 200) {
                            return;
                        }
                    } 
                    catch (err) {
                        console.error(err);
                    }
                    finally {
                      fetchData();
                      onDeleteClose();
                      reset();
                    }
                  } 
                  }
                  >
                    Delete
                  </Button>
                  <Button colorScheme='green' ref={cancelDeleteRef} onClick={onDeleteClose} ml={3}>
                    Cancel
                  </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
  </Flex>
  );
}
