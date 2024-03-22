import React, {
  useState,
  useEffect 
} from "react";
import {
    Box,
    Flex,  
    ChakraProvider, 
  } from "@chakra-ui/react";
import axiosInstance from "../axiosInstance";
import employeeDashboardTheme from "../themes/EmployeeDashboardTheme";
import styles from "./EmployeeDashboard.module.css";
import SideBarEmployee from "../Components/SideBarEmployee";
import NavBarEmployee from "../Components/NavBarEmployee";
import Inventory from "../Components/EmployeeDashboardComponents/Inventory.jsx";
import Orders from "../Components/EmployeeDashboardComponents/Orders.jsx";
import Analytics from "../Components/EmployeeDashboardComponents/Analytics.jsx";
import Employees from "../Components/EmployeeDashboardComponents/Employees.jsx";
import Components from "../Enums/EmployeeDashboardComponents.ts";

/**
 * Main function
 * 
 * @returns The statistic page containing Tabs leading to Highlights and Charts
 */
export default function EmployeeDashboard() {

    // Hooks for page switching 
    const [activeComponent, setActiveComponent] = useState(Components.Inventory);

    const handleComponentChange = (componentName) => {
      setActiveComponent(componentName);
    };

    // Query the data for the analytics
    const { weekRevenue, weekOrders } = useWeekData(); 
    const { monthRevenue, monthOrders } = useMonthData(); 
    const { yearRevenue, yearOrders } = useYearData();

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
                {activeComponent === Components.Analytics && Analytics(
                                                                      weekRevenue,                                                              
                                                                      weekOrders,
                                                                      monthRevenue,
                                                                      monthOrders,
                                                                      yearRevenue,
                                                                      yearOrders
                                                                      )
                                                                      }
                {activeComponent === Components.Employees && <Employees />}
              </Box>
            </ChakraProvider>
          </Flex>
        </Flex>
      </>
    );
}

/**
 * 
 * @returns { 
 *            weekRevenue   The revenue for the week ending yesterday
 *          } 
 */
function useWeekData() {

      // Hooks for week
      const [weekRevenueRaw, setWeekRevenueRaw] = useState(null);
      const [errMsg, setErrMsg] = useState("");
  
      useEffect(() => {
        async function fetchData() {
            try {
                let response = await axiosInstance.get(`/api/weekRevenue`);
                console.log(response);
                let data = response.data;
                console.log(data);
                if (response.status !== 200) {
                    setErrMsg(data);
                    return;
                }
                setWeekRevenueRaw(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
      }, []);
  
      // Error for weekRevenue
      if (errMsg.length > 0) 
      return <div>{errMsg}</div>;
  
      // Make sure necessary data is fetched
      if (weekRevenueRaw === null) 
        return <div>Loading. . .</div>;
      
      // Process data into a series ending on yesterday and starting 7 days before
      const weekdays = {
                        0: 'Sunday', 
                        1: 'Monday', 
                        2: 'Tuesday', 
                        3: 'Wednesday', 
                        4: 'Thursday', 
                        5: 'Friday', 
                        6: 'Saturday'
                      };
      let weekRevenueCategories = [];
      let weekRevenueData = [];
      for (let day = new Date().getDay(), i = 0; i < 7; day = ((day + 1) % 7), i++) {
        weekRevenueCategories[i] = weekdays[day];
        weekRevenueData[i] = weekRevenueRaw[weekdays[day]];
      }

      // TODO query data for week orders
      const weekOrders = {
      categories: ['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
      data: [37, 39, 15, 14, 43, 41, 40],
      seriesName: 'orders-by-week'
      };
  
      // Query the data for the analytics
      const weekRevenue = {
        categories: weekRevenueCategories,
        data: weekRevenueData,     
        seriesName: 'revenue-by-week'
      }; 

      return {weekRevenue, weekOrders};
}

/**
 * 
 * @returns 
 */
function useMonthData() {

    // Hooks for analytics
    const [monthRevenueRaw, setmonthRevenueRaw] = useState(null);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
      async function fetchData() {
          try {
              let response = await axiosInstance.get(`/api/monthRevenue`);
              console.log(response);
              let data = response.data;
              console.log(data);
              if (response.status !== 200) {
                  setErrMsg(data);
                  return;
              }
              setmonthRevenueRaw(data);
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
    if (monthRevenueRaw === null) 
      return <div>Loading. . .</div>;

    // Order the month data
    const months = {
                    0: 'January', 
                    1: 'February', 
                    2: 'March', 
                    3: 'April', 
                    4: 'May', 
                    5: 'June', 
                    6: 'July',
                    7: 'August',
                    8: 'September',
                    9: 'October',
                    10:'November',
                    11:'December'
                  };
    let monthRevenueCategories = [];
    let monthRevenueData = [];
    for (let month = new Date().getMonth() + 1, i = 0; i < 12; month = ((month + 1) % 12), i++) {
      monthRevenueCategories[i] = months[month];
      monthRevenueData[i] = monthRevenueRaw[months[month]];
    }

    const monthRevenue = {
      categories: monthRevenueCategories,
      data: monthRevenueData,
      seriesName: 'revenue-by-month'
    };

    const monthOrders = {
      categories: ['April', 'May', 'June', 'July', 'August', 'September', 'October', 
      'November', 'December', 'January', 'February', 'March'],
      data: [137, 150, 80, 90, 234, 50, 130, 15, 60, 58, 23, 19],
      seriesName: 'orders-by-month'
    };

    return {monthRevenue, monthOrders};
}

function useYearData() {

    // Hooks for analytics
    const [yearRevenueRaw, setyearRevenueRaw] = useState(null);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
      async function fetchData() {
          try {
              let response = await axiosInstance.get(`/api/yearRevenue`);
              console.log(response);
              let data = response.data;
              console.log(data);
              if (response.status !== 200) {
                  setErrMsg(data);
                  return;
              }
              setyearRevenueRaw(data);
          } catch (err) {
              console.error(err);
          }
      }
      fetchData();
    }, []);

    // Error for yearRevenue
    if (errMsg.length > 0) 
    return <div>{errMsg}</div>;

    // Make sure necessary data is fetched
    if (yearRevenueRaw === null) 
      return <div>Loading. . .</div>;

    // separate the categories and data
    let yearRevenueCategories = yearRevenueRaw.map(item => item.year);
    let yearRevenueData = yearRevenueRaw.map(item => item.revenue);

    const yearRevenue = {
      categories: yearRevenueCategories,
      data: yearRevenueData,
      seriesName: 'revenue-by-year'
    };

    const yearOrders = {
      categories: ['2022', '2023', '2024'],
      data: [1234, 1345, 1478],
      seriesName: 'orders-by-year'
    };

    return {yearRevenue, yearOrders};
}
