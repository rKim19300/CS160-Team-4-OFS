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
  
  // keep track of error msgs for each item in the users cart
  // if a product's quantity is invalid, it's product id will be added to this set
  // once its quantity is valid, it will be removed from the set
  // users can only checkout if this set is empty (memaning there's no errors)
  const [prodItemErrs, setProdItemErrs] = useState(new Set()); 
  // functions to add and remove product_ids from the `prodItemErrs` set
  // need to create a new set everytime we modify the set in order to update the state
  const addProdErr = prodID => {
    if (prodItemErrs.has(prodID)) return;
    setProdItemErrs(prev => new Set(prev).add(prodID));
  }
  const removeProdErr = prodID => {
    if (!prodItemErrs.has(prodID)) return;
    setProdItemErrs(prev => {
      const next = new Set(prev);
      next.delete(prodID);
      return next;
    });
  }

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
    let response = await axiosInstance.post("/api/removeItemFromCart", {
      product_id,
    });
    if (response.status === 200) {
      fetchCartData();
      removeProdErr(product_id);
    }
  }

  async function modifyCartItemQuantity(
    product,
    quantity,
    setCartItemErrMsg
  ) {
    console.log(quantity);
    const { product_id } = product;
    // Before making request to backend, check if `quantity` is within the valid bounds
    if (product.inventoryAmt <= 0) {
        setCartItemErrMsg(`Out of stock`);
        addProdErr(product_id);
        return;
    }
    if (quantity > product.inventoryAmt) {
      setCartItemErrMsg(`Maximum quantity allowed in cart: ${product.inventoryAmt}`);
      addProdErr(product_id);
      return;
    }
    if (quantity < 1) {
      setCartItemErrMsg(`Invalid quantity`);
      addProdErr(product_id);
      return;
    }
    // Make request to backend
    let response = await axiosInstance.post("/api/modifyCartItemQuantity", {
      product_id,
      quantity,
    });
    if (response.status === 200) {
      fetchCartData();
      setCartItemErrMsg("");
      removeProdErr(product_id);
    } else {
      setCartItemErrMsg(response.data);
      addProdErr(product_id);
    }
    console.log(response.data);
  }

  if (cartItems === null) return;

  return (
    <Flex>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={() => {
          onClose();
          setProdItemErrs(new Set()); // get rid of product item errors when cart window is closed
        }}
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
                <CartItem
                  key={product.product_id}
                  product={product}
                  removeItemFromCart={removeItemFromCart}
                  modifyCartItemQuantity={modifyCartItemQuantity}
                />
              ))
            )}
          </DrawerBody>

          <DrawerFooter className={styles.drawerFooter}>
            <Flex justifyContent="space-between" width="100%">
              <Text className={styles.bottomText}>Subtotal</Text>
              <Text className={styles.bottomText}>
                ${cartSubtotal.toFixed(2)}
              </Text>
            </Flex>
            <Flex justifyContent="space-between" width="100%">
              <Text className={styles.bottomText}>Delivery Fee</Text>
              <Text className={styles.bottomText}>
                ${deliveryFee.toFixed(2)}
              </Text>
            </Flex>
            <Flex justifyContent="space-between" width="100%">
              <Text className={styles.bottomText}>Tax & Services</Text>
              <Text className={styles.bottomText}>${taxAmount.toFixed(2)}</Text>
            </Flex>
            <Divider marginY="8px" />
            <Flex justifyContent="space-between" width="100%">
              <Text className={styles.bottomText}>Total</Text>
              <Text className={styles.bottomText}>
                ${(cartSubtotal + deliveryFee + taxAmount).toFixed(2)}
              </Text>
            </Flex>
            <a href="/checkout">
              <Button className={styles.checkoutButton} colorScheme="green" isDisabled={prodItemErrs.size > 0 || cartItems.length === 0}>
                Checkout
              </Button>
            </a>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

function CartItem({ product, removeItemFromCart, modifyCartItemQuantity }) {
  const [cartItemErrMsg, setCartItemErrMsg] = useState("");

  return (
    <Flex className={styles.outsideContainer}>
      <Flex className={styles.topSection}>
        <Flex alignItems="center" gap="8px">
          <img className={styles.itemImg} src={product.image_url} />
          <Text>{product.name}</Text>
        </Flex>

        <NumberInput
          size="xs"
          maxW={16}
          defaultValue={product.quantity}
          min={1}
          max={product.inventoryAmt}
          clampValueOnBlur={false}
          onChange={(newQuantity) => {
            modifyCartItemQuantity(
              product,
              newQuantity,
              setCartItemErrMsg
            )
          }}
        >
          <NumberInputField height="100%" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>

      <Flex className={styles.bottomSection}>
        <Text className={styles.priceText}>
          ${cartItemErrMsg.length < 1 ? (product.price * product.quantity).toFixed(2) : "0.00"}
        </Text>
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
      {cartItemErrMsg && (
        <Text fontSize="sm" color="red">
          {cartItemErrMsg}
        </Text>
      )}
    </Flex>
  );
}
