import React, {useEffect, useState, Component} from "react";
import {
    Center,
    Box,
    Flex,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel, 
    SimpleGrid, 
    extendTheme, 
    ChakraProvider
  } from "@chakra-ui/react";
import statisticsPageTheme from "../themes/StatisticsPageTheme";
import Chart from "react-apexcharts";
import styles from "./StatisticsPage.module.css"
import FadeInGrid from "../CustomComponents/FadeInGrid"

/**
 * Main function
 * 
 * @returns The statistic page containing Tabs leading to Highlights and Charts
 */
export default function StatisticsPage() {

    /**
     * @returns The highlights of the day for the for the Highlights tab
     */
    function Highlights() {
        return (
            <>
                <Flex>
                    <FadeInGrid columns={3} spacing={20} delay={50}>
                            <Box>
                                <Stat>
                                    <StatLabel>Sales</StatLabel>
                                    <StatNumber>$999.99</StatNumber>
                                    <StatHelpText>
                                        <StatArrow type='increase'/>
                                        24.05%
                                    </StatHelpText>
                                </Stat>
                            </Box>
                            <Box>
                            <Stat>
                                <StatLabel>Best Seller (Apples)</StatLabel>
                                <StatNumber>300 Qty.</StatNumber>
                                <StatHelpText>
                                    The store sold 300 Apples today!
                                </StatHelpText>
                            </Stat>
                        </Box>
                        <Box>
                            <Stat>
                                <StatLabel>Completed Orders</StatLabel>
                                <StatNumber>30</StatNumber>
                                <StatHelpText>
                                <StatArrow type='increase'/>
                                    10.75%
                                </StatHelpText>
                            </Stat>
                        </Box>
                        <Box>
                        </Box>
                    </FadeInGrid>
                </Flex>
            </>
        );
    }

    function Graphs() {

    }

    function Charts() {
        return (
            <>
                <Center>
                    <Box>
                        <App/>
                    </Box>
                </Center>
            </>
        );
    }


    return (
    <>
    <Center>
        <ChakraProvider resetCSS theme={statisticsPageTheme}>
            <Flex className={styles.container}>
                <Tabs isFitted={true} isLazy={true}>
                    <TabList>
                        <Tab>Highlights</Tab>
                        <Tab>Charts</Tab>
                        <Tab>Stock</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>{Highlights()}</TabPanel>
                        <TabPanel>{Charts()}</TabPanel>
                        <TabPanel></TabPanel>
                    </TabPanels>
                </Tabs>
            </Flex>
        </ChakraProvider>
    </Center>
    </>
    );
}

class App extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        options: {
          chart: {
            id: "basic-bar"
          },
          xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
          }
        },
        series: [
          {
            name: "series-1",
            data: [30, 40, 45, 50, 49, 60, 70, 91]
          }
        ]
      };
    }
  
    render() {
      return (
        <div className="app">
          <div className="row">
            <div className="mixed-chart">
              <Chart
                options={this.state.options}
                series={this.state.series}
                type="bar"
                width="500"
              />
            </div>
          </div>
        </div>
      );
    }
  }

