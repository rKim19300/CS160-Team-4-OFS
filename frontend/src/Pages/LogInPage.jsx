import React from "react";
import {
  Flex,
  Text,
  IconButton,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import styles from "./LogInPage.module.css";
import { ArrowBackIcon } from "@chakra-ui/icons";

export default function LogInPage() {
  return (
    <Flex className={styles.container}>
      <Text className={styles.welcomeText}>
        Welcome to <span style={{ color: "#28B463" }}>O</span>
        <span style={{ color: "#F39C12" }}>F</span>
        <span style={{ color: "#F4D03F" }}>S</span>!
      </Text>
      <Text className={styles.promptText}>
        Enter your email below to login to your account
      </Text>
      <Flex className={styles.LogInContainer}>
        <Flex className={styles.emailInputContainer}>
          <FormControl>
            <FormLabel className={styles.formText}>Email Address</FormLabel>
            <Input
              type="email"
              fontSize="16px"
              placeholder="johndoe@gmail.com"
            />
            <FormLabel className={styles.formText}>Password</FormLabel>
            <Input type="password" fontSize="16px" />
          </FormControl>

          <Button className={styles.continueButton}>Continue</Button>

          <a>
            <Text
              className={styles.bottomText}
              _hover={{ textDecoration: "underline" }}
            >
              Forgot Password?
            </Text>
          </a>

          {/* TODO: create account page href="/createAccount" */}
          <a>
            <Text className={styles.bottomText}>Create Account</Text>
          </a>
        </Flex>
      </Flex>
    </Flex>
  );
}
