import React, {useEffect, useState} from "react";
import {
  Box,
  SimpleGrid
} from "@chakra-ui/react";

/**
 * A SimpleGrid in which the components fade-in one-by-one
 * 
 * @param { children } The same children of the SimpleGrid in chakraUI
 * @param { delay }    The amount of delay between when each component is 
 *                     loaded into the grid
 * @param { spacing }  The spacing between the components
 * @param { columns }  The number of columns the components are divided into
 * @returns            A Grid in which each component fades in according a delay
 */
const FadeInGrid = ({ children, delay, spacing, columns}) => {
  const [isVisible, setIsVisible] = useState([]);

  useEffect(() => {
    const timeoutIds = [];
    children.forEach((_, index) => {
      timeoutIds.push(
        setTimeout(() => {
          setIsVisible((prev) => [...prev, index]);
        }, index * delay)
      );
    });

    // Clear timeouts on unmount
    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [children, delay]);

  return (
    <SimpleGrid columns={columns} spacing={spacing}>
      {children.map((child, index) => (
        <Box
          key={index}
          opacity={isVisible.includes(index) ? 1 : 0}
          transition="opacity 0.5s ease-in-out"
        >
          {child}
        </Box>
      ))}
    </SimpleGrid>
  );
};

// Exports
export default FadeInGrid;
