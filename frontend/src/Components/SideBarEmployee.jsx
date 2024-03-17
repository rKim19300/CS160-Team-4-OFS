import React from "react";
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
import Components from "../enums/EmployeeDashboardComponents.ts";
import SignOutButton from "./SignOutButton";

/**
 * @param { onComponentChange } Stores the name of the clicked component
 *                              which is sent to the main page. 
 * @returns                     The employee sidebar
 */
export default function SideBarCustomer({ onComponentChange }) {
    return (
        <Flex className={styles.container}>
          <Flex className={styles.categoriesContainer}>
            <Button 
            variant="ghost" 
            width="10vw" 
            onClick={() => onComponentChange(Components.Inventory)}
            >
                Inventory
            </Button>
            <Button 
            variant="ghost" 
            width="10vw" 
            onClick={() => onComponentChange(Components.Orders)}
            >
                Orders
            </Button>
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
                        <Button 
                        variant="ghost" 
                        width="8vw" 
                        onClick={() => onComponentChange(Components.Analytics)}
                        >
                          Analytics
                        </Button>
                        <br />
                        <Button 
                        variant="ghost" 
                        width="8vw" 
                        onClick={() => onComponentChange(Components.Employees)}
                        >
                          Employees
                        </Button>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
          </Flex>
          <Flex className={styles.bottomButtons}>
            <Button>
              <a href="/profile">Profile</a>
            </Button>
            <SignOutButton />
          </Flex>
        </Flex>
      );
}
