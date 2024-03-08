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
import axiosInstance from "../axiosInstance";
import { FaCartShopping, FaTrashCan } from "react-icons/fa6";

export default function ShoppingCart({ isOpen, onClose, btnRef }) {
  const [cartItems, setCartItems] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);

  // fetch the user's cart info from the backend
  async function fetchCartData() {
    let response = await axiosInstance.get("/api/viewCart");
    setCartItems(response.data.cartItems);
    setDeliveryFee(response.data.summary.deliveryFee);
    setCartSubtotal(response.data.summary.cartSubtotalCost);
    setTaxAmount(response.data.summary.taxAmount);
  }

  useEffect(() => {
    try {
      fetchCartData();
    } catch (err) {
      console.error(err);
    }
  }, []);

  async function removeItemFromCart(product_id) {
    let response = await axiosInstance.post("/api/removeItemFromCart", { product_id });
    if (response.status === 200) {
      fetchCartData();
    }
  }

  if (cartItems === null) return;

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
            {cartItems.length === 0 ? (
              <Text>Your cart is empty</Text>
            ) : (
              cartItems.map((product) => (
                <CartItem key={product.product_id} product={product} removeItemFromCart={removeItemFromCart} />
              ))
            )}
          </DrawerBody>

          <DrawerFooter className={styles.drawerFooter}>
            <Flex justifyContent="space-between" width="100%">
              <Text className={styles.bottomText}>Subtotal</Text>
              <Text className={styles.bottomText}>${cartSubtotal.toFixed(2)}</Text>
            </Flex>
            <Flex justifyContent="space-between" width="100%">
              <Text className={styles.bottomText}>Delivery Fee</Text>
              <Text className={styles.bottomText}>${deliveryFee.toFixed(2)}</Text>
            </Flex>
            <Flex justifyContent="space-between" width="100%">
              <Text className={styles.bottomText}>Tax & Services</Text>
              <Text className={styles.bottomText}>${taxAmount.toFixed(2)}</Text>
            </Flex>
            <Divider marginY="8px" />
            <Flex justifyContent="space-between" width="100%">
              <Text className={styles.bottomText}>Total</Text>
              <Text className={styles.bottomText}>${(cartSubtotal+deliveryFee+taxAmount).toFixed(2)}</Text>
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

function CartItem({ product, removeItemFromCart }) {
  return (
    <Flex className={styles.outsideContainer}>
      <Flex className={styles.topSection}>
        <Flex alignItems="center" gap="8px">
          <img
            className={styles.itemImg}
            src={product.image_url}
          />
          <Text>{product.name}</Text>
        </Flex>

        <NumberInput size="xs" maxW={16} defaultValue={product.quantity}>
          <NumberInputField height="100%" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>

      <Flex className={styles.bottomSection}>
        <Text className={styles.priceText}>${(product.price * product.quantity).toFixed(2)}</Text>
        <Button
          className={styles.removeButton}
          leftIcon={<FaTrashCan />}
          colorScheme="red"
          variant="ghost"
          onClick={() => removeItemFromCart(product.product_id)}
        >
          Remove
        </Button>
      </Flex>
    </Flex>
  );
}
