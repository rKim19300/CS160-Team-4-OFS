import React, { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import styles from "./CustomerPage.module.css";
import NavBarCustomer from "../Components/NavBarCustomer";
import SideBarCustomer from "../Components/SideBarCustomer";
import ProductCarousel from "../Components/ProductCarousel";

const fruitProducts = [
  {
    name: "Apple",
    price: "$1.99",
    weight: "1lb",
    img: "https://static.wikia.nocookie.net/the-snack-encyclopedia/images/7/7d/Apple.png",
  },
  {
    name: "Apple Juice",
    price: "$4.99",
    weight: "2lb",
    img: "https://s3.amazonaws.com/grocery-project/product_images/great-value-100-juice-apple-561635-9182579.jpg",
  },
  {
    name: "Orange",
    price: "$1.99",
    weight: "1lb",
    img: "https://m.media-amazon.com/images/I/710A+YmGSqL._AC_UF894,1000_QL80_.jpg",
  },
  {
    name: "Orange Juice",
    price: "$4.99",
    weight: "2lb",
    img: "https://target.scene7.com/is/image/Target/GUEST_2b7f75ea-fbb8-4767-8b1f-6bb809bfe214?wid=488&hei=488&fmt=pjpeg",
  },
];

export default function CustomerPage() {
  const [category, setCategory] = useState("ALL");
  const handleChangeCategory = (cat) => {
    setCategory(cat);
    console.log(cat);
  };
  return (
    <Flex className={styles.container}>
      <NavBarCustomer />
      <Flex className={styles.menuContent}>
        <SideBarCustomer handleChangeCategory={handleChangeCategory} />
        <CustomerPageBody category={category} products={fruitProducts} />
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
