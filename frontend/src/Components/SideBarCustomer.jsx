import React from "react";
import { Flex, Button } from "@chakra-ui/react";
import styles from "./SideBarCustomer.module.css";

const categories = [
  {
    text: "All Products",
    query: "",
  },
  {
    text: "Dairy & Eggs",
    query: "",
  },
  {
    text: "Vegetables",
    query: "",
  },
  {
    text: "Fruits",
    query: "",
  },
  {
    text: "Meat & Seafood",
    query: "",
  },
  {
    text: "Snacks & Candy",
    query: "",
  },
  {
    text: "Frozen",
    query: "",
  },
  {
    text: "More",
    query: "",
  },
  {
    text: "Buy It Again",
    query: "",
  },
];

export default function SideBarCustomer({ handleChangeCategory }) {
  return (
    <Flex className={styles.container}>
      <Flex className={styles.categoriesContainer}>
        {categories.map((category, idx) => (
          <Button
            className={`${styles.productButton} ${
              idx !== 0 && idx !== categories.length - 1 ? styles.indent : ""
            }`}
            key={idx}
            variant="ghost"
            onClick={() => handleChangeCategory(category.text)}
          >
            {category.text}
          </Button>
        ))}

        <Button variant="ghost">Orders</Button>
      </Flex>
      <Flex className={styles.bottomButtons}>
        <Button>
          <a href="/profile">Profile</a>
        </Button>
        <Button colorScheme="red">
          <a href="/">Sign Out</a>
        </Button>
      </Flex>
    </Flex>
  );
}
