import React, {
  useEffect, 
  useState, 
  Component
} from "react";
import {
    Center,
    Box,
    Flex,
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel,  
    ChakraProvider, 
    Menu,
    MenuButton, 
    Link,
  } from "@chakra-ui/react";
import employeeDashboardTheme from "../themes/EmployeeDashboardTheme";
import styles from "./EmployeeDashboard.module.css";
import SideBarEmployee from "../Components/SideBarEmployee";
import Inventory from "./EmployeeDashboardComponents/Inventory";
import Orders from "./EmployeeDashboardComponents/Orders";
import Analytics from "./EmployeeDashboardComponents/Analytics";
import Employees from "./EmployeeDashboardComponents/Employees";
import Components from "../enums/EmployeeDashboardComponents.ts";

/**
 * Main function
 * 
 * @returns The statistic page containing Tabs leading to Highlights and Charts
 */
export default function EmployeeDashboard() {

    const [activeComponent, setActiveComponent] = useState(Components.Inventory);

    const handleComponentChange = (componentName) => {
      setActiveComponent(componentName);
    };

    return (
      <>
          <ChakraProvider resetCSS theme={employeeDashboardTheme}>
            <Flex className={styles.container}>
              <Flex className={styles.menuContent}>
                <SideBarEmployee onComponentChange={handleComponentChange} />
                <Box flex="1" p={4}>
                  {activeComponent === Components.Inventory && <Inventory />}
                  {activeComponent === Components.Orders && <Orders />}
                  {activeComponent === Components.Analytics && <Analytics />}
                  {activeComponent === Components.Employees && <Employees />}
                </Box>
              </Flex>
            </Flex>
          </ChakraProvider>
      </>
    );
}
