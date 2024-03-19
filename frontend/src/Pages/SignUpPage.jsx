import React, { useState } from "react";
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
  useDisclosure,
  AlertDialogOverlay
} from "@chakra-ui/react";

import styles from "./SignUpPage.module.css";

import { UserType } from "../Enums/enums";
import useUserType from "../Hooks/useUserType";

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
const SignUpPage = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  const userTypeOnVisit = useUserType(0); // UserType of the person using the page

  const { isOpen, onOpen, onClose } = useDisclosure() // Disclosure for alert dialogue

  return (

    // Header Of The Page
    <div justification="center">
      <Text className={styles.welcomeText} marginTop="10px;">
        <span style={{ color: "#28B463" }}>O</span>
        <span style={{ color: "#F39C12" }}>F</span>
        <span style={{ color: "#F4D03F" }}>S</span> {(userTypeOnVisit === UserType.MANAGER) ? "Employee" : ""} Registration Form!
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

            // If mismatch, redirect to sign-up
            let userTypeOnSubmit = (await axiosInstance.get(`/api/getUserType`)).data.userType;
            if ((userTypeOnSubmit !== userTypeOnVisit)) {
              await axiosInstance.post("/api/removeItemFromCart", { email: values.email });
              return onOpen();
            }
            
            // Call API
            let response = await axiosInstance.post("/api/signup", {
              username: values.userName,
              email: values.email,
              password: values.password,
            });

            // if successful, json obj of user data { email, user_type, username, user_id }
            let responseMsg = response.data.message;

            // Handle successful registration, route depending on manager or not
            if (response.status === 200) {
              (userTypeOnSubmit === UserType.MANAGER) ?
              navigate("/EmployeeDashboard") : navigate("/");
            } else {
              setErrMsg(responseMsg); // Set error message based on API response
            }
          } catch (error) {
            console.error("Error registering user:", error);
            setErrMsg("Error registering user");
            alert(errMsg);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form className={styles.sigUpContainer}>
            <div className={styles.emailInputContainer}>
              <FormLabel className={styles.formText} htmlFor="userName">
                User Name:{" "}
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
        {/* Alert Dialogue sign-up failure */}
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
