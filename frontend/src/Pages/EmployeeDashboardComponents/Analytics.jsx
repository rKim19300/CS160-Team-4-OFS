
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
import Chart from "react-apexcharts";
import FadeInGrid from "../../CustomComponents/FadeInGrid"

/**
 * 
 */
export default function Analytics() {
    return (
        <>
        <Tabs isFitted={true} isLazy={true}>
        <TabList>
            <Tab>Week</Tab>
            <Tab>Month</Tab>
            <Tab>Year</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Center>
                <Box> 
                  <RevenueByWeek/>
                </Box>
              </Center>
            </TabPanel>
            <TabPanel></TabPanel>
            <TabPanel></TabPanel>
          </TabPanels>
        </Tabs>
        </>
    );
}

/**
 * @returns The highlights of the day for the for the Highlights tab
 */
function Highlights() {
return (
    <>
      <Flex>
        <FadeInGrid columns={3} spacing={10} delay={50}>
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


// TODO create const functions to fill the chart with data

/**
 * 
 */
class RevenueByWeek extends Component {

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
            data: [30, 40, 45, 50, 49, 60, 70, 91, ]
          }
        ]
      };
    }
  
    render() {
      return (
        <div className="revenue-by-week">
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

/**
 * 
 */
class RevenueByMonth extends Component {

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
          data: [30, 40, 45, 50, 49, 60, 70, 91, ]
        }
      ]
    };
  }

  render() {
    return (
      <div className="revenue-by-month">
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

/**
 * 
 */
class RevenueByYear extends Component {

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
          data: [30, 40, 45, 50, 49, 60, 70, 91, ]
        }
      ]
    };
  }

  render() {
    return (
      <div className="revenue-by-year">
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