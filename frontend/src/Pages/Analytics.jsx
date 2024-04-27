import React, {
  useState,
  useEffect,
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
    Heading,
    Flex
  } from "@chakra-ui/react";
import axiosInstance from "../axiosInstance";
import Chart from "react-apexcharts";

const weekdays = {
  0: 'Sunday', 
  1: 'Monday', 
  2: 'Tuesday', 
  3: 'Wednesday', 
  4: 'Thursday', 
  5: 'Friday', 
  6: 'Saturday'
};

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

/**
 * 
 */
export default function Analytics() {
    
    // Query the data for the analytics
    const [ weekRevenue, setWeekRevenue ] = useState(null); 
    const [ monthRevenue, setMonthRevenue ] = useState(null); 
    const [ yearRevenue, setYearRevenue ] = useState(null); 

    const dataNames = ['weekRevenue', 'monthRevenue', 'yearRevenue'];
    const setFunctions = [setWeekRevenue, setMonthRevenue, setYearRevenue];
    
    const fetchData = async (dataNames, setFunctions) => {
      for (let i = 0; i < dataNames.length; i++) {
        try {
            // Query database for the data
            let res = await axiosInstance.get(`/api/${dataNames[i]}`);
            
            // Check if the response worked
            if (res.status !== 200) {
                console.error(`Failed to get ${dataNames[i]} data`);
                return;
            }
    
            // Process the response data
            let data = await processData(res.data, dataNames[i]);
    
            // Update the state
            setFunctions[i](data);
        } 
        catch (err) {
            console.error(err);
        }
      }
    }

    // Grab all of the data
    useEffect(() => {
        fetchData(dataNames, setFunctions);
    }, []); 

    if (weekRevenue === null || monthRevenue === null || yearRevenue === null)
      return <div>Loading ...</div>;

    return (
        <Box marginLeft='200'>
          <Tabs isFitted={true} isLazy={true} margin={'auto'}>
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
                  <DataGraph 
                    state={setState(
                      weekRevenue.name, 
                      weekRevenue.categories, 
                      weekRevenue.data
                    )}
                  />
                  </Box>
                </Center>
              </TabPanel>
              {/* Month revenue/Order */}
              <TabPanel>
                <Center>
                  <Box> 
                    <Heading textAlign="center">Revenue by Month</Heading>
                    <DataGraph 
                      state={setState(
                        monthRevenue.name, 
                        monthRevenue.categories, 
                        monthRevenue.data,
                        'vertical'
                      )}
                    />
                  </Box>
                </Center>
              </TabPanel>
              {/* Year revenue/Order */}
              <TabPanel>
                <Center>
                  <Box> 
                    <Heading textAlign="center">Revenue by Year</Heading>
                    <DataGraph 
                      state={setState(yearRevenue.name, yearRevenue.categories, yearRevenue.data)}
                    />
                  </Box>
                </Center>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
    );
}

/**
 * @param dataName  The name used for the API endpoint
 */
async function processData(data, dataName) {

  let categories = [];
  let resData = [];

  switch (dataName) {
    case 'weekRevenue':
      for (let day = new Date().getDay(), i = 0; i < 7; day = ((day + 1) % 7), i++) {
        categories[i] = weekdays[day];
        resData[i] = data[weekdays[day]].toFixed(2);
      }
      break;
    case 'monthRevenue':
      for (let month = new Date().getMonth() + 1, i = 0; i < 12; month = ((month + 1) % 12), i++) {
        categories[i] = months[month];
        resData[i] = data[months[month]].toFixed(2);
      }
      break;
    case 'yearRevenue':
      categories = data.map(item => item.year);
      resData = data.map(item => item.revenue.toFixed(2));
      break;
  }

  return {
    categories: categories,
    data: resData,     
    name: dataName
  };
}

/**
 * Creates a state with the options for the data graphs
 */
function setState(name, categories, data, orientation='horizontal') {
  return {
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: categories
      },
      plotOptions: {
        bar: {
          dataLabels: {
            orientation: orientation,
            position: 'center' 
          }
        }
      }
    },
    series: [
      {
        name: name,
        data: data
      }
    ]
  };
}

interface DataGraphProps {
  state: any;
}

/**
 * Graphs the data
 */
class DataGraph extends Component<DataGraphProps> {

  constructor(props) {
    super(props);

    const { state } = this.props;

    this.state = state;
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
