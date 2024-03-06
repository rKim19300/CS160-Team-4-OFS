import {
    Heading,
    Divider,
    Box,
    Flex,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
} from "@chakra-ui/react";
import FadeInGrid from "../../CustomComponents/FadeInGrid"

export default function Employees() {
    return (
        <>
          <Flex alignContent={"center"} justifyContent={"center"}>
            <Heading>Employees</Heading>
          </Flex>
          <br />
          <Divider />
          <br />
          <Flex alignContent={"center"} justifyContent={"center"}>
            <FadeInGrid columns={3} spacing={10} delay={50}>
              <Box>
                <Stat>
                  <StatLabel>Alex</StatLabel>
                  <StatNumber>67 Orders Compl.</StatNumber>
                  <StatHelpText>
                      <StatArrow type='increase'/>
                      24.05%
                  </StatHelpText>
                </Stat>
              </Box>
              <Box>
                <Stat>
                  <StatLabel>Joe</StatLabel>
                  <StatNumber>17 Orders Compl.</StatNumber>
                  <StatHelpText>
                    <StatArrow type='decrease'/>
                    5.27%
                  </StatHelpText>
                </Stat>
              </Box>
              <Box>
                <Stat>
                  <StatLabel>Bob</StatLabel>
                  <StatNumber>30 Orders Compl.</StatNumber>
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