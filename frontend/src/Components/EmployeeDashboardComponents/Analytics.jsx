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
      Heading
    } from "@chakra-ui/react";
import Chart from "react-apexcharts";

/**
 * 
 */
export default function Analytics(weekRevenue, weekOrders, monthRevenue, monthOrders, 
  yearRevenue, yearOrders) {

    //alert(typeof(weekRevenue.categories[0]))
    //alert(typeof(weekRevenue.data[0]))

    return (
        <>
        <Tabs isFitted={true} isLazy={true}>
        <TabList>
            <Tab>Week</Tab>
            <Tab>Month</Tab>
            <Tab>Year</Tab>
          </TabList>
          <TabPanels>
            {/* Week revenue/Order */}
            <TabPanel>
              <Center>
                <Box> 
                <Heading textAlign="center">Revenue by Week)</Heading>
                <WeekRevenueGraph/>
                </Box>
              </Center>
            </TabPanel>
            {/* Month revenue/Order */}
            <TabPanel>
              <Center>
                <Box> 
                  <Heading textAlign="center">Revenue by Month</Heading>
                  <MonthRevenueGraph/>
                </Box>
              </Center>
            </TabPanel>
            {/* Year revenue/Order */}
            <TabPanel>
              <Center>
                <Box> 
                  <Heading textAlign="center">Revenue by Year</Heading>
                  <YearRevenueGraph/>
                </Box>
              </Center>
            </TabPanel>
          </TabPanels>
        </Tabs>
        </>
    );
}

// TODO Fill the charts with queried data

/**
 * 
 */
class WeekRevenueGraph extends Component {

    constructor(props) {
      super(props);

      //const { categories, seriesData } = this.props; // Assuming you're passing categories and seriesData as props

      this.state = {
        options: {
          chart: {
            id: "basic-bar"
          },
          xaxis: {
            categories: ['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday']
          }
        },
        series: [
          {
            name: "series-1",
            data: [1374, 1500, 608, 589, 2343, 1989, 1893]
          }
        ]
      };
    }

    render() {
      return (
        <div className="bar-graph">
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
class MonthRevenueGraph extends Component {

  constructor(props) {
    super(props);

    //const { categories, seriesData } = this.props; // Assuming you're passing categories and seriesData as props

    this.state = {
      options: {
        chart: {
          id: "basic-bar"
        },
        xaxis: {
          categories: ['April', 'May', 'June', 'July', 'August', 'September', 'October', 
          'November', 'December', 'January', 'February', 'March']
        }
      },
      series: [
        {
          name: "series-1",
          data: [13740, 15000, 6080, 5890, 23430, 19890, 18930, 15000, 6080, 5890, 23430, 19890]
        }
      ]
    };
  }

  render() {
    return (
      <div className="bar-graph">
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
  class YearRevenueGraph extends Component {

    constructor(props) {
      super(props);
  
      //const { categories, seriesData } = this.props; // Assuming you're passing categories and seriesData as props
  
      this.state = {
        options: {
          chart: {
            id: "basic-bar"
          },
          xaxis: {
            categories: ['2022', '2023', '2024']
          }
        },
        series: [
          {
            name: "series-1",
            data: [97800, 112897, 152389]
          }
        ]
      };
    }
  
    render() {
      return (
        <div className="bar-graph">
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