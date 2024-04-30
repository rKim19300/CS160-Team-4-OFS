import React, { useState, useEffect } from "react";
import { Flex, Button } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

import styles from "./SideBarCustomer.module.css";
import SignOutButton from "./SignOutButton";
import axiosInstance from "../axiosInstance";
import { UserType } from "../Enums/enums";

export default function SideBarCustomer({
  handleChangeCategory,
  handleSpecialView,
}) {
  const [categories, setCategories] = useState([]);
  const [userType, setUserType] = useState(0);

  async function fetchUserType() {
    try {
      let response = await axiosInstance.get("/api/viewUser");
      setUserType(response.data.user_type);
      console.log("usertype", userType);
    } catch (err) {
      console.error(err);
    }
  }

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
    fetchUserType();
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
        {/* <Link to="/customer/Buy%20It%20Again">
          <Button className={styles.productButton} variant="ghost">
            Buy It Again
          </Button>
        </Link> */}

        <Link to="orders">
          <Button variant="ghost" onClick={() => handleSpecialView("orders")}>
            Orders
          </Button>
        </Link>
      </Flex>
      <Flex className={styles.bottomButtons}>
        {(userType === UserType.MANAGER || userType === UserType.EMPLOYEE) && (
          <Link to="/employee">
            <Button width="100%" variant="outline">
              Employee View
            </Button>
          </Link>
        )}
        <Link to="profile">
          <Button width="100%">Profile</Button>
        </Link>
        <SignOutButton />
      </Flex>
    </Flex>
  );
}
