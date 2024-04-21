import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  IconButton,
  useDisclosure,
  Box
} from "@chakra-ui/react";
import ShoppingCart from "../Pages/ShoppingCart";
import styles from "./NavBarCustomer.module.css";
import { Search2Icon } from "@chakra-ui/icons";
import { FaCartShopping } from "react-icons/fa6";
import axiosInstance from "../axiosInstance";

export default function NavBarCustomer() {
  const navigate = useNavigate();

  const fetchSearchResults = async (inputVal) => {
    try {
      if (!inputVal) {
        return [];
      }
      const response = await axiosInstance.get(`/api/searchProducts/?query=${inputVal}`);
      const data = response.data;
      console.log("Fetched search results", data);
      return data.map(item => ({
        value: item.product_id,
        label: item.name,
        redirectTo: `/customer/productInfo/${item.product_id}`
      }));
    } catch (error) {
      console.error("Error fetching search results:", error);
      return [];
    }
  };

  const handleChange = (selectedOption) => {
    console.log("INSIDE HANDLE CHANGE. SELECTED OPTION:", selectedOption);
    if (selectedOption && selectedOption.redirectTo) {
      navigate(selectedOption.redirectTo);
    }
  }

  const { isOpen, onToggle, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <>
      <Flex className={styles.container}>
        <Flex className={styles.leftSide}>
          <a href="/customer" className={styles.linkWrapper}>
            <img className={styles.logoImg} src="/logo.png" />
          </a>

          <InputGroup className={styles.searchBarContainer}>
            {/* <Input
              value={searchText}
              onChange={handleChange}
              type="text"
              placeholder="Search"
            /> */}
            <AsyncSelect 
              className={styles.searchBar}
              cacheOptions
              loadOptions={fetchSearchResults}
              placeholder="Search"
              isClearable
              onChange={handleChange}
              noOptionsMessage={() => null} // Hide the "No options" message
              />
            {/* <InputRightElement>
              <IconButton
                className={styles.searchIcon}
                icon={<Search2Icon />}
                onClick={handleSearch}
              />
            </InputRightElement> */}
          </InputGroup>
        </Flex>

        <Button
          className={styles.cartButton}
          leftIcon={<FaCartShopping />}
          ref={btnRef}
          onClick={onToggle}
        >
          Cart
        </Button>
      </Flex>
      <ShoppingCart isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
    </>
  );
}
