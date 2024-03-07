import React, { useState, useEffect, useRef } from "react";
import {
  Flex,
  Text,
  Icon,
  Input,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
} from "@chakra-ui/react";
import styles from "./ShoppingCart.module.css";
import { FaCartShopping, FaTrashCan } from "react-icons/fa6";

export default function ShoppingCart({ isOpen, onClose, btnRef }) {
  return (
    <Flex>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent className={styles.cartContents}>
          <DrawerCloseButton />
          <DrawerHeader>
            <Flex alignItems="center" gap="12px">
              <Text>Shopping Cart</Text>
              <Icon as={FaCartShopping} />
            </Flex>
          </DrawerHeader>

          <DrawerBody>
            <CartItem />
          </DrawerBody>

          <DrawerFooter className={styles.drawerFooter}>
            <Flex justifyContent="space-between" width="100%">
              <Text className={styles.bottomText}>Subtotal</Text>
              <Text className={styles.bottomText}>$1.99</Text>
            </Flex>
            <Flex justifyContent="space-between" width="100%">
              <Text className={styles.bottomText}>Delivery Fee</Text>
              <Text className={styles.bottomText}>Free</Text>
            </Flex>
            <Flex justifyContent="space-between" width="100%">
              <Text className={styles.bottomText}>Tax & Services</Text>
              <Text className={styles.bottomText}>$1.00</Text>
            </Flex>
            <Divider marginY="8px" />
            <Flex justifyContent="space-between" width="100%">
              <Text className={styles.bottomText}>Total</Text>
              <Text className={styles.bottomText}>$2.99</Text>
            </Flex>
            <Button className={styles.checkoutButton} colorScheme="green">
              Checkout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

function CartItem() {
  return (
    <Flex className={styles.outsideContainer}>
      <Flex className={styles.topSection}>
        <Flex alignItems="center" gap="8px">
          <img
            className={styles.itemImg}
            src="https://static.wikia.nocookie.net/the-snack-encyclopedia/images/7/7d/Apple.png"
          />
          <Text>Apple Juice</Text>
        </Flex>

        <NumberInput size="xs" maxW={16} defaultValue={1}>
          <NumberInputField height="100%" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>

      <Flex className={styles.bottomSection}>
        <Text className={styles.priceText}>$1.99</Text>
        <Button
          className={styles.removeButton}
          leftIcon={<FaTrashCan />}
          colorScheme="red"
          variant="ghost"
        >
          Remove
        </Button>
      </Flex>
    </Flex>
  );
}
