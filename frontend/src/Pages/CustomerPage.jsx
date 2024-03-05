import React, { useState, useEffect } from "react";
import { Flex, Text } from "@chakra-ui/react";
import styles from "./CustomerPage.module.css";
import NavBarCustomer from "../Components/NavBarCustomer";
import SideBarCustomer from "../Components/SideBarCustomer";
import ProductCarousel from "../Components/ProductCarousel";
import axiosInstance from "../axiosInstance";

export default function CustomerPage() {
  const [category, setCategory] = useState("ALL");
  const [allProducts, setAllProducts] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axiosInstance.get("/api/allProducts");
        setAllProducts(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  const handleChangeCategory = (cat) => {
    setCategory(cat);
    console.log(cat);
  };

  if (allProducts === null) return;

  return (
    <Flex className={styles.container}>
      <NavBarCustomer />
      <Flex className={styles.menuContent}>
        <SideBarCustomer handleChangeCategory={handleChangeCategory} />
        <CustomerPageBody category={category} products={allProducts} />
      </Flex>
    </Flex>
  );
}

function CustomerPageBody({ category, products }) {
  return (
    <Flex className={styles.bodyContainer}>
      <Text className={styles.categoryText}>{category}</Text>
      <ProductCarousel products={products} />
    </Flex>
  );
}
