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
    IconButton
} from "@chakra-ui/react";
import { AddIcon } from '@chakra-ui/icons'
import FadeInGrid from "../../CustomComponents/FadeInGrid"

export default function Employees() {
    return (
        <>
          <Flex alignContent={"center"} justifyContent={"center"}>
            <Heading>Employees</Heading>
          </Flex>
          <br />
          <Flex alignContent={"center"} justifyContent={"center"}>
          <IconButton
              colorScheme='green'
              aria-label='Call Segun'
              size='lg'
              icon={<AddIcon />}
            />
          </Flex>
          <br />
          <Divider />
          <br />
          <Flex alignContent={"center"} justifyContent={"center"}>
            <FadeInGrid columns={3} spacing={10} delay={50}>
              <Box>
                <Stat>
                  <StatLabel>Alex Smith</StatLabel>
                  <StatHelpText>
                      ID #6543
                  </StatHelpText>
                </Stat>
              </Box>
              <Box>
                <Stat>
                  <StatLabel>Joe Rodriguez</StatLabel>
                  <StatHelpText>
                    ID #1234
                  </StatHelpText>
                </Stat>
              </Box>
              <Box>
                <Stat>
                  <StatLabel>Joey Doe</StatLabel>
                  <StatNumber></StatNumber>
                  <StatHelpText>
                      ID #1336
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