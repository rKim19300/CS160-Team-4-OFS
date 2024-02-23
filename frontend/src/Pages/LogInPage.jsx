import React, {useState} from "react";
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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const handleSubmit = async (event) => {
        // this function runs when we press "Continue" button
        event.preventDefault();
        let response = await fetch(`http://localhost:8888/login`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        });
        let responseMsg = await response.text();
        console.log(responseMsg);
        if (!response.ok) {
            // something went wrong while logging in
            setErrMsg(responseMsg); // TODO: Display this error message on the page
        }
    }

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
            <form onSubmit={handleSubmit}>
                <FormControl>
                  <FormLabel className={styles.formText}>Email Address</FormLabel>
                  <Input
                    type="email"
                    fontSize="16px"
                    placeholder="johndoe@gmail.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <FormLabel className={styles.formText}>Password</FormLabel>
                  <Input type="password" fontSize="16px" onChange={(e) => setPassword(e.target.value)} />
                </FormControl>
                <Button className={styles.continueButton} type="submit">Continue</Button>
            </form>

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
