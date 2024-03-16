import React, { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Icon,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import styles from "./ProfilePage.module.css";
import NavBarCustomer from "../Components/NavBarCustomer";
import SideBarCustomer from "../Components/SideBarCustomer";

import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import {
  FaRegFaceGrinTongue,
  FaRegFaceGrinSquint,
  FaRegFaceGrinTongueSquint,
  FaRegFaceSurprise,
  FaRegFaceSmile,
} from "react-icons/fa6";

export default function ProfilePage() {
  const icons = [
    <FaRegFaceGrinTongue className={styles.profileIcon} />,
    <FaRegFaceGrinSquint className={styles.profileIcon} />,
    <FaRegFaceGrinTongueSquint className={styles.profileIcon} />,
    <FaRegFaceSurprise className={styles.profileIcon} />,
    <FaRegFaceSmile className={styles.profileIcon} />,
  ];

  const [userId, setUserId] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [icon, setIcon] = useState(icons[0]);

  async function fetchData() {
    let response = await axiosInstance.get("/api/viewUser");
    setUserId(response.data.user_id);
    setUsername(response.data.username);
    setEmail(response.data.email);

    const iconIndex = response.data.user_id % icons.length;
    setIcon(icons[iconIndex]);
    console.log(icon);
  }

  useEffect(() => {
    try {
      fetchData();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      let response = await axiosInstance.post("/api/updateUser", {
        username,
        email,
      });
      console.log("User info updated!");
      toast.success("Account updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Flex className={styles.container}>
      <Toaster position="bottom-right" reverseOrder={false} />
      <NavBarCustomer />
      <Flex className={styles.menuContent}>
        <SideBarCustomer />
        <Flex className={styles.bodyContainer}>
          <Text className={styles.headerText}>Account Setting</Text>
          <form className={styles.form} onSubmit={handleSave}>
            {/* <Icon as={icon} className={styles.profileIcon} /> */}
            <div>{icon}</div>
            <FormControl>
              <FormLabel className={styles.formText}>Name</FormLabel>
              <Input
                type="text"
                fontSize="16px"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <FormLabel className={styles.formText}>Email Address</FormLabel>
              <Input
                type="email"
                fontSize="16px"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <Button className={styles.button} colorScheme="green" type="submit">
              Save
            </Button>
          </form>
        </Flex>
      </Flex>
    </Flex>
  );
}
