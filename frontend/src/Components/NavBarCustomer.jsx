import React, { useState } from "react";
import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  IconButton,
} from "@chakra-ui/react";
import styles from "./NavBarCustomer.module.css";
import { Search2Icon } from "@chakra-ui/icons";
import { FaCartShopping } from "react-icons/fa6";

export default function NavBarCustomer() {
  const [searchText, setSearchText] = useState("");
  const handleChange = (event) => setSearchText(event.target.value);
  const handleSearch = () => {
    if (searchText === "") return;

    // TODO: add search logic
    console.log("searching for...", searchText);
    setSearchText("");
  };

  const handleCart = () => {
    console.log("cart is clicked");
  };

  return (
    <Flex className={styles.container}>
      <Flex className={styles.leftSide}>
        <a href="/customer" className={styles.linkWrapper}>
          <img className={styles.logoImg} src="logo.png" />
        </a>

        <InputGroup className={styles.searchBarContainer}>
          <Input
            value={searchText}
            onChange={handleChange}
            type="text"
            placeholder="Search "
          />
          <InputRightElement>
            <IconButton
              className={styles.searchIcon}
              icon={<Search2Icon />}
              onClick={handleSearch}
            />
          </InputRightElement>
        </InputGroup>
      </Flex>

      <Button
        className={styles.cartButton}
        leftIcon={<FaCartShopping />}
        onClick={handleCart}
      >
        Cart
      </Button>
    </Flex>
  );
}
