import React, { useState, useEffect } from "react";
import { 
    Flex, 
    Button, 
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Box
} from "@chakra-ui/react";
import styles from "./SideBarEmployee.module.css";
import Components from "../Enums/EmployeeDashboardComponents.ts";
import SignOutButton from "./SignOutButton";
import { UserType } from "../Enums/enums.js";
import axiosInstance from "../axiosInstance";
import { Link } from "react-router-dom";

/**
 * @param { onComponentChange } Stores the name of the clicked component
 *                              which is sent to the main page. 
 * @returns                     The employee sidebar
 */
export default function SideBarEmployee({ onComponentChange }) {

    // Get userType
    const [ userType, setUserType ] = useState(0);

    async function fetchUserType() {
        try {
          let response = await axiosInstance.get("/api/viewUser");
          setUserType(response.data.user_type);

        } catch (err) {
          console.error(err);
        }
    }

    useEffect(() => {fetchUserType();}, []);

    return (
        <Flex className={styles.container}>
          <Flex className={styles.categoriesContainer}>
            <Link to="inventory" >
            <Button 
            variant="ghost" 
            width="10vw" 
            // onClick={() => onComponentChange(Components.Inventory)}
            >
                Inventory
            </Button>
            </Link>
            <Link to="orders" >
            <Button 
            variant="ghost" 
            width="10vw" 
            // onClick={() => onComponentChange(Components.Orders)}
            >
                Orders
            </Button>
            </Link>
            <Link to="map" >
            <Button 
            variant="ghost" 
            width="10vw" 
            >
                Map
            </Button>
            </Link>
            {userType === UserType.MANAGER && <ManagerAccordion onComponentChange={ onComponentChange }/>}
          </Flex>
          <Flex className={styles.bottomButtons}>
            <Button>
              <a href="/customer/profile">Profile</a>
            </Button>
            <SignOutButton />
          </Flex>
        </Flex>
      );
}

function ManagerAccordion({ onComponentChange }) {
  return (
    <Accordion allowMultiple>
      <AccordionItem>
          <AccordionButton 
          variant="ghost" 
          fontWeight="semibold" 
          borderRadius="10px"
          border="none"
          width="10vw"
          justifyContent="center"
          >
              <Box>
                  Store
              </Box>
          </AccordionButton>
          <AccordionPanel>
              <Link to="analytics">
              <Button 
              variant="ghost" 
              width="8vw" 
              // onClick={() => onComponentChange(Components.Analytics)}
              >
                Analytics
              </Button>
              </Link>
              <br />
              <Link to="staff">
              <Button 
              variant="ghost" 
              width="8vw" 
              // onClick={() => onComponentChange(Components.Employees)}
              >
                Employees
              </Button>
              </Link>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
  );
}
