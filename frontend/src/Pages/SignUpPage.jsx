import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

import {
  Text,
  Button,
  FormLabel,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";

import styles from "./SignUpPage.module.css";

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

const handleRegistration = async (values) => {
  // this function runs when we press "Submit"
  try {
    // Call the insert_new_user function from the DB class
    // await DB.insert_new_user(values.email, values.userName, values.password);

    console.log("User registered successfully!");
  } catch (error) {
    console.error("Error registering user:", error);
  }
};

const FormComponent = () => {
  return (
    <div justification="center">
      <Text className={styles.welcomeText} marginTop="100px;">
        <span style={{ color: "#28B463" }}>O</span>
        <span style={{ color: "#F39C12" }}>F</span>
        <span style={{ color: "#F4D03F" }}>S</span> Registration Form!
      </Text>

      <Formik
        initialValues={{
          userName: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          // Call the insert_new_user function from the DB class
          // Handle form submission here
          await handleRegistration(values);
          console.log(values);
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
              {/* TODO: Handle email existed */}
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

            <div>
              <Button
                className={styles.continueButton}
                margin="20px"
                type="submit"
                disabled={isSubmitting}
              >
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormComponent;
