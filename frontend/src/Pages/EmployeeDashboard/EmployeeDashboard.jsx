import React, {
  useEffect, 
  useState, 
  Component
} from "react";
import {
    Center,
    Box,
    Flex,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
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
import statisticsPageTheme from "../../themes/StatisticsPageTheme";
import Chart from "react-apexcharts";
import styles from "./EmployeeDashboard.module.css"
import FadeInGrid from "../../CustomComponents/FadeInGrid"
import Inventory from "./EmployeeDashboardComponents/Inventory";
import Orders from "./EmployeeDashboardComponents/Orders";
import Analytics from "./EmployeeDashboardComponents/Analytics";
import Employees from "./EmployeeDashboardComponents/Employees";


/**
 * Main function
 * 
 * @returns The statistic page containing Tabs leading to Highlights and Charts
 */
export default function StatisticsPage() {
    return (
      <>
      <Center>
          <ChakraProvider resetCSS theme={statisticsPageTheme}>
              <Flex className={styles.container}>
                  <Tabs isFitted={true} isLazy={true} orientation="vertical">
                      <TabList>
                          <Tab>Inventory</Tab>
                          <Tab>Orders</Tab>
                          <Tab>Analytics</Tab>
                          <Tab>Employees</Tab>
                      </TabList>
                      <TabPanels>
                          <TabPanel>{Inventory()}</TabPanel>
                          <TabPanel>{Orders()}</TabPanel>
                          <TabPanel>{Analytics()}</TabPanel>
                          <TabPanel>{Employees()}</TabPanel>
                      </TabPanels>
                  </Tabs>
              </Flex>
          </ChakraProvider>
      </Center>
      </>
    );
}
