import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import {
  Flex,
  Text,
  IconButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import styles from "./LogInPage.module.css";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { UserType } from "../Enums/enums";

export default function LogInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false); // State for error dialog
  const errorDialogRef = useRef(); // Ref for error dialog

  const handleSubmit = async (event) => {
    // this function runs when we press "Continue" button
    event.preventDefault();
    let response = await axiosInstance.post("/api/login", { email, password });
    let data = response.data; // if successful, json obj of user data { email, user_type, username, user_id }
    if (response.status === 200) {
      navigate(data.user_type === UserType.CUSTOMER ? "/customer" : "/employee");
    } else {
      setErrMsg(data);
      setErrorDialogOpen(true);
    }
  };

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
              <Input
                type="password"
                fontSize="16px"
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button className={styles.continueButton} type="submit">
              Continue
            </Button>
          </form>

          <a>
            <Text
              className={styles.bottomText}
              _hover={{ textDecoration: "underline" }}
            >
              Forgot Password?
            </Text>
          </a>

          <a href="./SignUp">
            <Text
              className={styles.bottomText}
              _hover={{ textDecoration: "underline" }}
            >
              Create Account
            </Text>
          </a>
        </Flex>
      </Flex>
      {/* AlertDialog for error: Email or Password mismatch Data base */}
      <AlertDialog
        motionPreset="slideInBottom"
        status="error"
        leastDestructiveRef={errorDialogRef}
        onClose={() => setErrorDialogOpen(false)}
        isOpen={errorDialogOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>ERROR!!!</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            {errMsg}! The email or password you entered did not match our
            records. Please check both and try again.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              colorScheme="red"
              ref={errorDialogRef}
              onClick={() => setErrorDialogOpen(false)}
            >
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Flex>
  );
}
