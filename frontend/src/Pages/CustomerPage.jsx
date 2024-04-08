import React, { useState, useEffect } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useParams, Outlet, useLocation } from "react-router-dom";

import styles from "./CustomerPage.module.css";
import NavBarCustomer from "../Components/NavBarCustomer";
import SideBarCustomer from "../Components/SideBarCustomer";
import ProductCarousel from "../Components/ProductCarousel";
import axiosInstance from "../axiosInstance";

export default function CustomerPage() {
  const [cats, setCategory] = useState("ALL");
  const [allProducts, setAllProducts] = useState(null);

  const [view, setView] = useState({ type: "category", name: "ALL" });
  let { category } = useParams();

  const location = useLocation();
  console.log(location.pathname);

  if (location.pathname === "/customer") {
    category = "ALL";
  }

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
    setView({ type: "category", name: cat });
    console.log(cat);
  };

  const handleSpecialView = (viewName) => {
    setView({ type: viewName });
  };

  if (allProducts === null) return;

  return (
    <Flex className={styles.container}>
      <NavBarCustomer />
      <Flex className={styles.menuContent}>
        <SideBarCustomer
          handleChangeCategory={handleChangeCategory}
          handleSpecialView={handleSpecialView}
        />
        {category ? (
          <CustomerPageBody
            category={category || "ALL"}
            products={allProducts}
          />
        ) : (
          <Outlet />
        )}
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
