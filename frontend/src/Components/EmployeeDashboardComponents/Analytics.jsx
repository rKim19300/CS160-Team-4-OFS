import React, {
    Component
  } from "react";
import {
    Center,
    Box,
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

    /* Get the charts for week to year revenue */
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
              categories: weekRevenue.categories 
            }
          },
          series: [
            {
              name: weekRevenue.seriesName,
              data: weekRevenue.data 
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
                  width="600"
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

        this.state = {
          options: {
            chart: {
              id: "basic-bar"
            },
            xaxis: {
              categories: monthRevenue.categories
            },
            plotOptions: {
              bar: {
                dataLabels: {
                  orientation: 'vertical',
                  position: 'center' 
                }
              }
            }
          },
          series: [
            {
              name: monthRevenue.name,
              data: monthRevenue.data
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
                  width="600"
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
    
        this.state = {
          options: {
            chart: {
              id: "basic-bar"
            },
            xaxis: {
              categories: yearRevenue.categories
            }
          },
          series: [
            {
              name: yearRevenue.name,
              data: yearRevenue.data
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
                  width="600"
                />
              </div>
            </div>
          </div>
        );
      }
    }

    /* Return statement for analytics function */
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
                <Heading textAlign="center">Revenue by Week</Heading>
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
