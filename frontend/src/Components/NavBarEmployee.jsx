import React, { useState } from "react";
import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  IconButton,
} from "@chakra-ui/react";
import styles from "./NavBarEmployee.module.css";
import { Search2Icon } from "@chakra-ui/icons";

export default function NavBarEmployee() {
  return (
    <Flex className={styles.container}>
      <Flex className={styles.leftSide}>
        <a href="/customer" className={styles.linkWrapper}>
          <img className={styles.logoImg} src="/logo.png" />
        </a>
      </Flex>
    </Flex>
  );
}