import React, { useState, useEffect } from "react";
import {
  Flex,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import styles from "./ProfilePage.module.css";
import NavBarEmployee from "../Components/NavBarEmployee";
import SideBarEmployee from "../Components/SideBarEmployee";

import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";

export default function ChangeProductPage() {

  const [productId, setProductId] = useState(0);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [quantity, setQuantity] = useState("");

  async function fetchData() {
    try {
      let response = await axiosInstance.get("/api/productInfo/:prodID");
      setName(response.data.name);
      setPrice(response.data.price);
      setWeight(response.data.weight);
      setQuantity(response.data.quantity);

    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      let response = await axiosInstance.post("/api/updateUser", {
        name,
        price,
        weight,
        quantity
      });
      if (response.status === 200) {
        console.log("Product info updated!");
        toast.success("Item updated successfully!");
      } else {
        toast.error(response.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product!");
    }
  };

  return (
    <Flex className={styles.container}>
      <Toaster position="bottom-right" reverseOrder={false} />
      <NavBarEmployee />
      <Flex className={styles.menuContent}>
        <SideBarEmployee />
        <Flex className={styles.bodyContainer}>
          <Text className={styles.headerText}>Change Product </Text>
          <form className={styles.form} onSubmit={handleSave}>
            <FormControl>
              <FormLabel className={styles.formText}>Name</FormLabel>
              <Input
                type="text"
                fontSize="16px"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FormLabel className={styles.formText}>Price</FormLabel>
              <Input
                type="text"
                fontSize="16px"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <FormLabel className={styles.formText}>Weight</FormLabel>
              <Input
                type="text"
                fontSize="16px"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <FormLabel className={styles.formText}>Quantity</FormLabel>
              <Input
                type="text"
                fontSize="16px"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
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
