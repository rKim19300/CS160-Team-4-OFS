import React, {
  useState,
  useEffect 
} from "react";
import {
    Box,
    Flex,  
    ChakraProvider, 
  } from "@chakra-ui/react";
import {
  Outlet, useLocation, useParams
} from "react-router-dom";
import axiosInstance from "../axiosInstance";
import employeeDashboardTheme from "../themes/EmployeeDashboardTheme";
import styles from "./EmployeeDashboard.module.css";
import SideBarEmployee from "../Components/SideBarEmployee";
import NavBarEmployee from "../Components/NavBarEmployee";
import Inventory from "./InventoryPage.jsx";
import Orders from "./OrdersPage.jsx";
import Analytics from "./Analytics.jsx";
import Employees from "./EmployeesInfoPage.jsx";
import Components from "../Enums/EmployeeDashboardComponents.ts";
import InventoryPage from "./InventoryPage.jsx";

/**
 * Main function
 * 
 * @returns The statistic page containing Tabs leading to Highlights and Charts
 */
export default function EmployeeDashboard() {
    let { category } = useParams();

    // Hooks for page switching 
    const [activeComponent, setActiveComponent] = useState(Components.Inventory);

    const handleComponentChange = (componentName) => {
      setActiveComponent(componentName);
    };

    const location = useLocation();
    console.log(location.pathname);

    if (location.pathname === "/employee") {
      category = "inventory";
    }

    return (
      <>
        <Flex className={styles.container}>
          <NavBarEmployee />
          <Flex className={styles.menuContent}>
            <SideBarEmployee onComponentChange={handleComponentChange} />
            {category === "inventory" ? <InventoryPage /> : <Outlet/>}
            <ChakraProvider resetCSS theme={employeeDashboardTheme}>
              <Box flex="1" p={4}>
                {/* {activeComponent === Components.Inventory && <Inventory />}
                {activeComponent === Components.Orders && <Orders />}
                {activeComponent === Components.Analytics && Analytics(
                                                                      weekRevenue,                                                              
                                                                      weekOrders,
                                                                      monthRevenue,
                                                                      monthOrders,
                                                                      yearRevenue,
                                                                      yearOrders
                                                                      )
                                                                      }
                {activeComponent === Components.Employees && <Employees />} */}
              </Box>
            </ChakraProvider>
          </Flex>
        </Flex>
        
      </>
    );
}
