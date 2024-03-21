import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

import {
  Text,
  Button,
  FormLabel,
  Stack,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure
} from "@chakra-ui/react";

import styles from "./SignUpPage.module.css";

// Create Schema to validate user inputs using Yup
const validationSchema = Yup.object().shape({
  userName: Yup.string().required("userName is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase, one lowercase, one special character, and one number with a minimum of eight characters"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

// Main Sign Up Function
const SignUpPage = ({ createEmployee=false, onSignUpSuccess = () => {}}) => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  const [status, setStatus] = useState("");

  const [errorDialogOpen, setErrorDialogOpen] = useState(false); // State for error dialog
  const [successDialogOpen, setSuccessDialogOpen] = useState(false); // State for success dialog

  // Create refs for AlertDialog
  const errorDialogRef = useRef();
  const successDialogRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure() // Disclosure for alert dialogue

  return (

    // Header Of The Page
    <div justification="center">
      <Text className={styles.welcomeText} marginTop="10px;">
        <span style={{ color: "#28B463" }}>O</span>
        <span style={{ color: "#F39C12" }}>F</span>
        <span style={{ color: "#F4D03F" }}>S</span> {(createEmployee) ? "Employee" : ""} Registration Form!
      </Text>

      {/* Create Formik components for validation */}
      <Formik
        initialValues={{
          userName: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            
            // Check if creating employee or customer
            let apiCall = (createEmployee) ? "/api/createEmployee" : "/api/signup";

            // Call API
            let response = await axiosInstance.post(apiCall, {
              username: values.userName,
              email: values.email,
              password: values.password,
            });

            // if successful, json obj of user data { email, user_type, username, user_id }
            let responseMsg = response.data.message;

            // Handle successful registration, route depending on manager or not
            if (response.status === 200) {
              setStatus("success");
              console.log("status= " + status);
              setSuccessDialogOpen(true);
              // navigate("./");
              onSignUpSuccess(); // Tell caller signUp was a success
              if (!createEmployee) navigate("/");   
            } else if (response.status === 401) {
              return onOpen(); // Employee registration fail
            } else {
              setStatus("error");
              console.log("status= " + status);
              setErrMsg(responseMsg); // Set error message based on API response
              setErrorDialogOpen(true);
            }
          } catch (error) {
            console.error("Error registering user:", error);
            setErrMsg("Error registering user");
            alert(errMsg);
            setErrorDialogOpen(true); // Open error dialog
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form className={styles.sigUpContainer}>
            <div className={styles.emailInputContainer}>
              <FormLabel className={styles.formText} htmlFor="userName">
                Your Name:{" "}
              </FormLabel>
              <Field
                className={styles.formBoxInput}
                type="text"
                name="userName"
              />

              <ErrorMessage name="userName" component="div" className="error" />
            </div>

            <div className={styles.emailInputContainer}>
              {/* TODO: Handle email existed - Error send back from BackEnd*/}
              <FormLabel className={styles.formText} htmlFor="email">
                Email Address:{" "}
              </FormLabel>
              <Field className={styles.formBoxInput} type="text" name="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className={styles.emailInputContainer}>
              <FormLabel className={styles.formText} htmlFor="password">
                Password:{" "}
              </FormLabel>
              <Field
                className={styles.formBoxInput}
                type="password"
                name="password"
              />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            {/* Next feature Plan: Click to show password
            <div class="showpassword_box"><input type="checkbox" id="checkbox"><p>Show password</p></div>
            <Checkbox
              size="sm"
              colorScheme="green"
              defaultChecked
              isChecked={checkedItems[0]}
              onChange={(e) =>
                setCheckedItems([e.target.checked, checkedItems[1]])
              }
            >
              Show Password
            </Checkbox> */}

            <div>
              <PasswordStrengthIndicator password={values.password} />
            </div>

            <div className={styles.emailInputContainer}>
              <FormLabel className={styles.formText} htmlFor="confirmPassword">
                Confirm Password:
              </FormLabel>
              <Field
                className={styles.formBoxInput}
                type="password"
                name="confirmPassword"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="error"
              />
            </div>

            {/* Link back to Log In Page */}
            <Stack spacing={4} direction="row" align="center">
              <Text className={styles.bottomText}> Already a member? </Text>
              <a href="./">
                <Text
                  className={styles.bottomText}
                  _hover={{ textDecoration: "underline" }}
                >
                  Log In
                </Text>
              </a>
            </Stack>

            <Button
              className={styles.continueButton}
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
      <div>
        {status === "success" ? (
          <AlertDialog
            motionPreset="slideInBottom"
            status="success"
            leastDestructiveRef={successDialogRef}
            onClose={() => setSuccessDialogOpen(false)}
            isOpen={successDialogOpen}
            isCentered
          >
            <AlertDialogOverlay />

            <AlertDialogContent>
              <AlertDialogHeader>Account created!</AlertDialogHeader>
              <AlertDialogCloseButton />
              <AlertDialogBody>
                Thanks for signing up to OFS. Enjoy shopping!!!
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  colorScheme="green"
                  ref={successDialogRef}
                  onClick={() => {
                    setSuccessDialogOpen(false);
                    navigate("./");
                  }}
                >
                  Back to Log In
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
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
                {/* {errMsg} */}
                The email you entered is already exists. Please use another
                email or use the forget password at log in page!!!
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  colorScheme="green"
                  ref={errorDialogRef}
                  onClick={() => setErrorDialogOpen(false)}
                >
                  OK
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* <AlertDialog
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
              {errMsg}
              The email you entered is already exists. Please use another email
              or use the forget password at log in page!!! {errMsg}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                colorScheme="green"
                ref={errorDialogRef}
                onClick={() => setErrorDialogOpen(false)}
              >
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          motionPreset="slideInBottom"
          status="success"
          leastDestructiveRef={successDialogRef}
          onClose={() => setSuccessDialogOpen(false)}
          isOpen={successDialogOpen}
          isCentered
        >
          <AlertDialogOverlay />

          <AlertDialogContent>
            <AlertDialogHeader>Account created!</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Thanks for signing up to OFS. Enjoy shopping!!!
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                colorScheme="green"
                ref={successDialogRef}
                onClick={() => {
                  setSuccessDialogOpen(false);
                  navigate("./");
                }}
              >
                Back to Log In
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog> */}
      </div>
        {/* Alert Dialogue for employee sign-up failure */}
        <AlertDialog 
            isOpen={isOpen}
            onClose={onClose}
            isCentered={true} 
        >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Something went wrong!
            </AlertDialogHeader>
            <AlertDialogBody>
              Please go back to the Sign-In Page.
            </AlertDialogBody>
            <AlertDialogFooter>
                <Button colorScheme='red' onClick={
                  async () => {
                    try {
                      navigate("/");
                    }
                    catch (err) {
                      console.error(err);
                    }
                    finally {
                      onClose();
                    }
                  }
                }>
                  Okay
                </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>

  );
};

export default SignUpPage;
