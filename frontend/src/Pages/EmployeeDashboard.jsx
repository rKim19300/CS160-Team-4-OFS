import React, {
  useState, 
} from "react";
import {
    Box,
    Flex,  
    ChakraProvider, 
  } from "@chakra-ui/react";
import employeeDashboardTheme from "../themes/EmployeeDashboardTheme";
import styles from "./EmployeeDashboard.module.css";
import SideBarEmployee from "../Components/SideBarEmployee";
import NavBarEmployee from "../Components/NavBarEmployee";
import Inventory from "../Components/EmployeeDashboardComponents/Inventory.jsx";
import Orders from "../Components/EmployeeDashboardComponents/Orders.jsx";
import Analytics from "../Components/EmployeeDashboardComponents/Analytics.jsx";
import Employees from "../Components/EmployeeDashboardComponents/Employees.jsx";
import Components from "../enums/EmployeeDashboardComponents.ts";

/**
 * Main function
 * 
 * @returns The statistic page containing Tabs leading to Highlights and Charts
 */
export default function EmployeeDashboard() {

    // Query the data for the analytics
    const weekRevenue = {
      categories: ['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
      data: [1374, 1500, 608, 589, 2343, 1989, 1893],     
      seriesName: 'revenue-by-week'
    };

    const weekOrders = {
      categories: ['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
      data: [37, 39, 15, 14, 43, 41, 40],
      seriesName: 'orders-by-week'
    };

    const monthRevenue = {
      categories: ['April', 'May', 'June', 'July', 'August', 'September', 'October', 
      'November', 'December', 'January', 'February', 'March'],
      data: [13740, 15000, 6080, 5890, 23430, 19890, 18930, 15000, 6080, 5890, 23430, 19890],
      seriesName: 'revenue-by-month'
    };

    const monthOrders = {
      categories: ['April', 'May', 'June', 'July', 'August', 'September', 'October', 
      'November', 'December', 'January', 'February', 'March'],
      data: [137, 150, 80, 90, 234, 50, 130, 15, 60, 58, 23, 19],
      seriesName: 'orders-by-month'
    };

    const yearRevenue = {
      categories: ['2022', '2023', '2024'],
      data: [97800, 112897, 152389],
      seriesName: 'revenue-by-year'
    };

    const yearOrders = {
      categories: ['2022', '2023', '2024'],
      data: [1234, 1345, 1478],
      seriesName: 'orders-by-year'
    };

    const [activeComponent, setActiveComponent] = useState(Components.Inventory);

    const handleComponentChange = (componentName) => {
      setActiveComponent(componentName);
    };

    return (
      <>
        <Flex className={styles.container}>
          <NavBarEmployee />
          <Flex className={styles.menuContent}>
            <SideBarEmployee onComponentChange={handleComponentChange} />
            <ChakraProvider resetCSS theme={employeeDashboardTheme}>
              <Box flex="1" p={4}>
                {activeComponent === Components.Inventory && <Inventory />}
                {activeComponent === Components.Orders && <Orders />}
                {activeComponent === Components.Analytics && Analytics(weekRevenue,                                                              
                                                                      weekOrders,
                                                                      monthRevenue,
                                                                      monthOrders,
                                                                      yearRevenue,
                                                                      yearOrders)
                /*<Analytics 
                                                              weekRevenue={weekRevenue}
                                                              weekOrders={weekOrders}
                                                              monthRevenue={monthRevenue}
                                                              monthOrders={monthOrders}
                                                              yearRevenue={yearRevenue}
                                                              yearOrders={yearOrders}
                                                            />*/}
                {activeComponent === Components.Employees && <Employees />}
              </Box>
            </ChakraProvider>
          </Flex>
        </Flex>
      </>
    );
}
