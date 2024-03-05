import React, { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "./ProductCarousel.module.css";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export default function ProductCarousel({ products }) {
  return (
    <div style={{ width: "100%", paddingTop: "16px" }}>
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        centerMode
        draggable
        infinite
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        responsive={responsive}
        swipeable
      >
        {products.map((product, idx) => (
          <ProductItem key={idx} product={product} />
        ))}
      </Carousel>
    </div>
  );
}

function ProductItem({ product }) {
  return (
    <Flex className={styles.productItem}>
      <img className={styles.prodImg} src={product.img} />
      <Text className={styles.productTitle}>{product.name}</Text>
      <Text className={styles.productPrice}>{product.price}</Text>
      <Text className={styles.productWeight}>{product.weight}</Text>
    </Flex>
  );
}
