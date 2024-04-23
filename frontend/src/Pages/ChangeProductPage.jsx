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
  Textarea,
  NumberInput,
  NumberInputField
} from "@chakra-ui/react";
import styles from "./ChangeProductPage.module.css";
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

  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  // Function to handle when a category option is (un)selected
  const handleCheckboxChange = (categoryObj) => {
    if (selectedCategoryIds.includes(categoryObj.category_id)) {
      setSelectedCategoryIds(selectedCategoryIds.filter(item => item !== categoryObj.category_id));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, categoryObj.category_id]);
    }
    console.log(selectedCategoryIds);
  };

  const handleRemove = () => {
    setQuantity(-1);
  }

  async function fetchData() {
    try {
      let response = await axiosInstance.get(`/api/productInfo/${id}`);
      setName(response.data.name);
      setPrice(response.data.price.toFixed(2));
      setWeight(response.data.weight);
      setQuantity(response.data.quantity);
      setImage(response.data.image_url);
      setDescription(response.data.description);
      setSelectedCategoryIds(response.data.categories.map(e => e.category_id));
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchCategories() {
    let res = await axiosInstance.get("/api/allCategories");
    setCategories(res.data);
  }

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      let response = await axiosInstance.post(`/api/updateProduct/${id}`, {
        name,
        price,
        weight,
        quantity,
        image_url: image,
        description,
        category_ids: selectedCategoryIds
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
              <Image src={image || "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png"} boxSize={{xl: "410px", "2xl": "450px"}} objectFit="cover" />
              <Textarea placeholder="Write product description here" mt="10px" fontSize="16px" value={description} onChange={(e) => setDescription(e.target.value)}>{description}</Textarea>
            </Box>

            <form className={styles.form} onSubmit={handleSave}>
              <FormControl>
                <FormLabel className={styles.formText}>Name</FormLabel>
                <Input
                  type="text"
                  fontSize="16px"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isRequired={true}
                />
                <FormLabel className={styles.formText}>Price</FormLabel>
                <NumberInput
                  fontSize="16px"
                  value={price}
                  precision={2}
                  onChange={(val) => setPrice(val)}
                  min={0.01}
                  max={100}
                  isRequired={true}
                >
                  <NumberInputField />
                </NumberInput>
                <FormLabel className={styles.formText}>Weight</FormLabel>
                <NumberInput
                  fontSize="16px"
                  value={weight}
                  precision={1}
                  onChange={(val) => setWeight(val)}
                  min={0.1}
                  max={100}
                  isRequired={true}
                >
                  <NumberInputField />
                </NumberInput>
                <FormLabel className={styles.formText}>Quantity</FormLabel>
                <NumberInput
                  fontSize="16px"
                  value={quantity}
                  onChange={(val) => setQuantity(val)}
                  isRequired={true}
                >
                  <NumberInputField />
                </NumberInput>
                <FormLabel className={styles.formText}>Image URL</FormLabel>
                <Input
                  type="text"
                  fontSize="16px"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  isRequired={true}
                />
                <FormLabel className={styles.formText}>Categories</FormLabel>
                <div className={styles.categoryContainer}>
                  <div className={styles.checkboxContainer}>
                    {/* List of options with checkboxes */}
                    {categories.map((categoryObj, index) => (
                      <label key={index} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          value={categoryObj.name}
                          checked={selectedCategoryIds.includes(categoryObj.category_id)}
                          onChange={() => handleCheckboxChange(categoryObj)}
                        />
                        {categoryObj.name}
                      </label>
                    ))}
                  </div>
                </div>
              </FormControl>

              <Button className={styles.button} colorScheme="green" type="submit">
                Save
              </Button>

              <Button className={styles.button} colorScheme="red" onClick={handleRemove} type="submit">
                Remove
              </Button>

            </form>
          </HStack>
        </Flex>
      </Flex>
    </Flex>
  );
}
