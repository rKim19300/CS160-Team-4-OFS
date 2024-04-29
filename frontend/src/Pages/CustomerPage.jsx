import React, { useState, useEffect } from "react";
import { Flex, Text, Grid } from "@chakra-ui/react";
import { useParams, Outlet, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import styles from "./CustomerPage.module.css";
import NavBarCustomer from "../Components/NavBarCustomer";
import SideBarCustomer from "../Components/SideBarCustomer";
import ProductCarousel from "../Components/ProductCarousel";
import axiosInstance from "../axiosInstance";

export default function CustomerPage() {
  const [cats, setCategory] = useState("ALL");
  const [displayedProducts, setDisplayedProducts] = useState(null);

  const [view, setView] = useState({ type: "category", name: "ALL" });
  let { category } = useParams();

  const location = useLocation();
  console.log(location.pathname);

  if (location.pathname === "/customer") {
    category = "ALL";
  }

  async function fetchProducts(category_name) {
    try {
      let response;
      if (category_name === "ALL") {
        response = await axiosInstance.get("/api/allProducts");
      } else {
        response = await axiosInstance.get(
          `/api/products/category_name=${category_name}`
        );
      }
      if (response.status !== 200) {
        setDisplayedProducts([]);
        return;
      }
      // only display products that are available (quantity > -1)
      setDisplayedProducts(response.data.filter((prod) => prod.quantity > -1));
      console.log(displayedProducts);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchProducts(category);
  }, [category]);

  useEffect(() => {
    if (category === undefined) return;
    fetchProducts(category);
  }, []);

  const handleChangeCategory = (cat) => {
    setCategory(cat);
    setView({ type: "category", name: cat });
    console.log(cat);
  };

  const handleSpecialView = (viewName) => {
    setView({ type: viewName });
  };

  if (displayedProducts === null) return;
  console.log(displayedProducts);

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
            products={displayedProducts}
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
      {/* <ProductCarousel products={products} /> */}
      <Grid templateColumns="repeat(5, 1fr)" gap="32px" marginTop="16px">
        {products.map((product, idx) => (
          <ProductItem key={idx} product={product} />
        ))}
      </Grid>
    </Flex>
  );
}

function ProductItem({ product }) {
  return (
    <Flex className={styles.productItem}>
      <img className={styles.prodImg} src={product.image_url} />
      <Flex flexDirection="column">
        <Link to={`/customer/productInfo/${product.product_id}`}>
          <Text className={styles.productTitle}>{product.name}</Text>
        </Link>
        <Text className={styles.productPrice}>${product.price.toFixed(2)}</Text>
        <Text className={styles.productWeight}>{product.weight} lbs</Text>
      </Flex>
    </Flex>
  );
}
