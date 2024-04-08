import React, { useState, useEffect } from "react";
import { Flex, Button } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

import styles from "./SideBarCustomer.module.css";
import SignOutButton from "./SignOutButton";
import axiosInstance from "../axiosInstance";

export default function SideBarCustomer({
  handleChangeCategory,
  handleSpecialView,
}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        let response = await axiosInstance.get("/api/allCategories");
        setCategories(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <Flex className={styles.container}>
      <Flex className={styles.categoriesContainer}>
        <Link to="/customer">
          <Button className={styles.productButton} variant="ghost">
            All Products
          </Button>
        </Link>
        {categories.map((category, idx) => (
          <Link to={`/customer/${category.name}`}>
            <Button
              className={styles.indent}
              key={idx}
              variant="ghost"
              onClick={() => handleChangeCategory(category.name)}
            >
              {category.name}
            </Button>
          </Link>
        ))}
        <Link to="/customer/Buy%20It%20Again">
          <Button className={styles.productButton} variant="ghost">
            Buy It Again
          </Button>
        </Link>

        <Link to="orders">
          <Button variant="ghost" onClick={() => handleSpecialView("orders")}>
            Orders
          </Button>
        </Link>
      </Flex>
      <Flex className={styles.bottomButtons}>
        <Link to="profile">
          <Button width="100%">
            <a href="/profile">Profile</a>
          </Button>
        </Link>
        <SignOutButton />
      </Flex>
    </Flex>
  );
}
