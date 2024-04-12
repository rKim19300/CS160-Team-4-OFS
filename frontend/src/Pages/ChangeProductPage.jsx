import React, { useState, useEffect } from "react";
import {
  Flex,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  Box,
  Image,
} from "@chakra-ui/react";
import styles from "./ProfilePage.module.css";
import { useParams, useNavigate } from "react-router-dom";

import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";

export default function ChangeProductPage() {
  let { id } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  async function fetchData() {
    try {
      let response = await axiosInstance.get(`/api/productInfo/${id}`);
      setName(response.data.name);
      setPrice(response.data.price);
      setWeight(response.data.weight);
      setQuantity(response.data.quantity);
      setImage(response.data.image_url);
      setDescription(response.data.description);
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
      let response = await axiosInstance.post(`/api/updateProduct/${id}`, {
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
    <Flex className={styles.container} width="100%">
      <Toaster position="bottom-right" reverseOrder={false} />
      <Flex className={styles.menuContent}>
        <Flex flexDirection="column" alignItems="center" ml={{base: "80px", "2xl": "150px"}} p={{base: "20px", "2xl": "40px"}}>
        <Text className={styles.headerText}>Edit Product </Text>
          <HStack spacing={{base: "90px", "2xl": "120px"}} justify="center">

            <Box maxW="450px">
              <Image src={image} boxSize={{xl: "410px", "2xl": "450px"}} objectFit="cover" />
              <Text mt="10px" fontSize="lg">{description}</Text>
            </Box>

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
                <FormLabel className={styles.formText}>Image URL</FormLabel>
                <Input
                  type="text"
                  fontSize="16px"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
                <FormLabel className={styles.formText}>Description</FormLabel>
                <Input
                  type="text"
                  fontSize="16px"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>

              <Button className={styles.button} colorScheme="green" type="submit">
                Save
              </Button>
            </form>
          </HStack>
        </Flex>
      </Flex>
    </Flex>
  );
}
