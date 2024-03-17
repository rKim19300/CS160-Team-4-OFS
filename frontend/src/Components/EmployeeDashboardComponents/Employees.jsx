import React, {
  useState,
  useEffect 
} from "react";
import {
    Heading,
    Divider,
    Box,
    Flex,
    Stat,
    StatLabel,
    StatHelpText,
    IconButton
} from "@chakra-ui/react";
import { AddIcon } from '@chakra-ui/icons'
import FadeInGrid from "../../CustomComponents/FadeInGrid"
import axiosInstance from "../../axiosInstance";
import { Link } from "react-router-dom";

export default function Employees() {

    // Hooks for Employees
    const [employees, setEmployees] = useState(null);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
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
      fetchData();
    }, []);

    // Error for monthRevenue
    if (errMsg.length > 0) 
    return <div>{errMsg}</div>;

    // Make sure necessary data is fetched
    if (employees === null) 
      return <div>Loading. . .</div>;

    

    return (
        <>
          <Flex alignContent={"center"} justifyContent={"center"}>
            <Heading>Employees</Heading>
          </Flex>
          <br />
          <Flex alignContent={"center"} justifyContent={"center"}>
          <Link to='/SignUp'>
            <IconButton
                colorScheme='green'
                aria-label='Call Segun'
                size='lg'
                icon={<AddIcon />}
              />
          </Link>
          </Flex>
          <br />
          <Divider />
          <br />
          <Flex alignContent={"center"} justifyContent={"center"}>
            <FadeInGrid columns={3} spacing={10} delay={50}>
            {employees.map((employee, idx) => (
              <EmployeeGridCard key={idx} employee={employee} />
            ))}
            </FadeInGrid>
          </Flex>
        </>
    );
}

function EmployeeGridCard({ employee }) {

  console.log(employee);

  return (
    <Box>
    <Stat>
      <StatLabel>{employee.username}</StatLabel>
      <StatHelpText>
          ID #{employee.user_id}
      </StatHelpText>
    </Stat>
  </Box>
  );
}
