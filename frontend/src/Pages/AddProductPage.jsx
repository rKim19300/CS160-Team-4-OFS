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
  NumberInputField,
  Tooltip
} from "@chakra-ui/react";
import styles from "./ChangeProductPage.module.css";
import { useParams, useNavigate } from "react-router-dom";

import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  async function fetchCategories() {
    let res = await axiosInstance.get("/api/allCategories");
    setCategories(res.data);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // Function to handle when a category option is (un)selected
  const handleCheckboxChange = (categoryObj) => {
    if (selectedCategoryIds.includes(categoryObj.category_id)) {
      setSelectedCategoryIds(selectedCategoryIds.filter(item => item !== categoryObj.category_id));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, categoryObj.category_id]);
    }
    console.log(selectedCategoryIds);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      let response = await axiosInstance.post(`/api/addProduct`, {
        name, 
        description, 
        image_url: image,
        price, 
        weight, 
        quantity, 
        category_ids: selectedCategoryIds
      });
      if (response.status === 200) {
        console.log("Product created!");
        toast.success("Item added successfully!");
      } else {
        toast.error(response.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product!");
    }
  };

  // whether or not to show the red box telling the user that their input is wrong
  const [showToolTip, setShowToolTip] = useState({
      weight: false,
      price: false,
      quantity: false
  });
  const isInvalidWeight = weight !== "" && (weight < 0.1 || weight > 100);
  const isInvalidPrice = price !== "" && (price < 0.01 || price > 100);
  const isInvalidQuantity = quantity !== "" && (quantity < 1 || quantity > 100);

  return (
    <Flex className={styles.container} width="100%">
      <Toaster position="bottom-right" reverseOrder={false} />
      <Flex className={styles.menuContent}>
        <Flex flexDirection="column" alignItems="center" ml={{base: "80px", "2xl": "150px"}} p={{base: "20px", "2xl": "40px"}}>
        <Text className={styles.headerText}>Add Product </Text>
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
                <Tooltip
                  hasArrow
                  label="Please enter a price between 0.01 and 100"
                  isOpen={showToolTip.price && isInvalidPrice}
                  placement="bottom"
                  bg='red.600'
                >
                  <NumberInput
                    fontSize="16px"
                    value={price}
                    precision={2}
                    onChange={(val) => setPrice(val)}
                    isRequired={true}
                    isInvalid={isInvalidPrice}
                    onBlur={() => setShowToolTip({ ...showToolTip, price: isInvalidPrice })}
                    onFocus={() => setShowToolTip({ ...showToolTip, price: false })}
                  >
                    <NumberInputField />
                  </NumberInput>
                </Tooltip>
                <FormLabel className={styles.formText}>Weight</FormLabel>
                <Tooltip
                  hasArrow
                  label="Please enter a weight between 0.1 and 100"
                  isOpen={showToolTip.weight && isInvalidWeight}
                  placement="bottom"
                  bg='red.600'
                >
                  <NumberInput
                    fontSize="16px"
                    value={weight}
                    precision={1}
                    onChange={(val) => setWeight(val)}
                    isRequired={true}
                    isInvalid={isInvalidWeight}
                    onBlur={() => setShowToolTip({ ...showToolTip, weight: isInvalidWeight })}
                    onFocus={() => setShowToolTip({ ...showToolTip, weight: false })}
                  >
                    <NumberInputField />
                  </NumberInput>
                </Tooltip>
                <FormLabel className={styles.formText}>Quantity</FormLabel>
                <Tooltip
                  hasArrow
                  label="Please enter a quantity between 1 and 100"
                  isOpen={showToolTip.quantity && isInvalidQuantity}
                  placement="bottom"
                  bg='red.600'
                >
                  <NumberInput
                    fontSize="16px"
                    value={quantity}
                    precision={0}
                    onChange={(val) => setQuantity(val)}
                    isRequired={true}
                    isInvalid={isInvalidQuantity}
                    onBlur={() => setShowToolTip({ ...showToolTip, quantity: isInvalidQuantity })}
                    onFocus={() => setShowToolTip({ ...showToolTip, quantity: false })}
                  >
                    <NumberInputField />
                  </NumberInput>
                </Tooltip>
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

              <Button className={styles.button} colorScheme="green" type="submit" isDisabled={isInvalidQuantity || isInvalidPrice || isInvalidWeight}>
                Save
              </Button>
            </form>
          </HStack>
        </Flex>
      </Flex>
    </Flex>
  );
}
