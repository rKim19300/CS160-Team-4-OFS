import React, { useState, useEffect, useRef } from "react";
import {
  Flex,
  Text,
  Step,
  useSteps,
  Stepper,
  StepIcon,
  StepNumber,
  StepIndicator,
  StepStatus,
  StepTitle,
  StepDescription,
  StepSeparator,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Icon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
} from "@chakra-ui/react";
import styles from "./CheckoutPage.module.css";
import axiosInstance from "../axiosInstance";
import NavBarCustomer from "../Components/NavBarCustomer";
import {
  FaCartShopping,
  FaTrashCan,
  FaCarRear,
  FaCcVisa,
  FaCircleCheck,
} from "react-icons/fa6";

const steps = [
  { title: "Delivery", description: "Enter Address" },
  { title: "Payment", description: "Card Information" },
  { title: "Confirm", description: "Place Order" },
  { title: "Order Confirmation", description: "" },
];
const handleSubmit = () => {
  console.log("Form submitted");
};

let addressInfo = {};

export default function CheckoutPage({ variant }) {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;
  const isConfirmationStep = activeStep === 2;

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [errMsg, setErrMsg] = useState(null);
  const handleConfirm = async () => {
    let response = await axiosInstance.post("/api/placeOrder", {
      "street_address": Object.values(addressInfo).join(", ").replace(/\s\s+/g, ' ')
    });
    if (response.status !== 200) {
      // setErrMsg(response.data);
      console.log(response.data);
      return;
    }
    console.log("Order has been placed");
    setActiveStep(steps.length - 1);
  };

  console.log(addressInfo);

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <Step1Component handleNext={handleNext} />;
      case 1:
        return <Step2Component handleNext={handleNext} />;
      case 2:
        return <Step3Component />;
      case 3:
        return <Step4Component />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <Flex className={styles.container}>
      <NavBarCustomer />
      <Flex className={styles.contentContainer}>
        <Stepper size="lg" colorScheme="green" index={activeStep}>
          {steps.map((step, index) => (
            <Step
              key={index}
              //   onClick={() => (index !== 3 ? setActiveStep(index) : null)}
            >
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>
        {renderStepContent(activeStep)}

        <Flex className={styles.stepperButton}>
          {!isFirstStep && !isLastStep && (
            <Button onClick={handleBack}>Back</Button>
          )}
          {!isLastStep && !isConfirmationStep && (
            <Button
              form={ activeStep === 0 ? "addressForm" : "paymentForm"}
              type="submit"
              // onClick={handleNext}
              className={styles.nextButton}
              colorScheme="green"
            >
              Next
            </Button>
          )}

          {isConfirmationStep && (
            <Button onClick={handleConfirm} colorScheme="green">
              Confirm
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

function Step1Component({ handleNext }) {
  const submitForm = (e) => {
    // set the addressInfo 
    addressInfo = {
      "addressLine1": e.target.addressLine1.value,
      "addressLine2": e.target.addressLine2.value,
      "city": e.target.city.value,
      "state": e.target.state.value,
      "zipCode": e.target.zipCode.value
    }
    // set the "activeStep" state of the parent component by calling handleNext
    handleNext();
  }

  return (
    <Flex className={styles.formContainer}>
      <Flex alignItems="center" gap="12px">
        <Text className={styles.titleText}>Delivery Information</Text>
        <Icon as={FaCarRear} />
      </Flex>

      <form id="addressForm" onSubmit={submitForm}>
        <FormControl>
          <FormLabel className={styles.formText}>Address Line 1</FormLabel>
          <Input type="text" fontSize="16px" required name="addressLine1" />

          <FormLabel className={styles.formText}>Address Line 2</FormLabel>
          <Input type="text" fontSize="16px" name="addressLine2" />
        </FormControl>

        <Flex justifyContent="space-between" paddingTop="8px">
          <Flex flexDirection="column">
            <FormLabel className={styles.formText}>City</FormLabel>
            <Input type="text" fontSize="16px" required name="city" />
          </Flex>

          <Flex flexDirection="column">
            <FormLabel className={styles.formText}>State</FormLabel>
            <Input type="text" fontSize="16px" required name="state" />
          </Flex>

          <Flex flexDirection="column">
            <FormLabel className={styles.formText}>Zip Code</FormLabel>
            <Input type="number" fontSize="16px" required name="zipCode" />
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
}

function Step2Component({ handleNext }) {
  const submitForm = (e) => {
    // do payment input checks here

    // update "activeStep" state in parent component
    handleNext();
  }

  return (
    <Flex className={styles.formContainer}>
      <Flex alignItems="center" gap="12px">
        <Text className={styles.titleText}>Payment Information</Text>
        <Icon as={FaCcVisa} />
      </Flex>
      <form id="paymentForm" onSubmit={submitForm}>
        <FormControl>
          <FormLabel className={styles.formText}>Name on Card</FormLabel>
          <Input type="text" fontSize="16px" required />

          <FormLabel className={styles.formText}>Card Number</FormLabel>
          <Input type="number" fontSize="16px" required />
        </FormControl>

        <Flex justifyContent="space-between" paddingTop="8px">
          <Flex flexDirection="column">
            <FormLabel className={styles.formText}>Expiry Date</FormLabel>
            <Input type="text" fontSize="16px" required />
          </Flex>

          <Flex flexDirection="column">
            <FormLabel className={styles.formText}>CVV</FormLabel>
            <Input type="number" fontSize="16px" required />
          </Flex>

          <Flex flexDirection="column">
            <FormLabel className={styles.formText}>Zip Code</FormLabel>
            <Input type="number" fontSize="16px" required />
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
}

function Step3Component() {
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
    let response = await axiosInstance.post("/api/removeItemFromCart", {
      product_id,
    });
    if (response.status === 200) {
      fetchCartData();
    }
  }

  async function modifyCartItemQuantity(
    product_id,
    quantity,
    setCartItemErrMsg
  ) {
    console.log(quantity);
    let response = await axiosInstance.post("/api/modifyCartItemQuantity", {
      product_id,
      quantity,
    });
    if (response.status === 200) {
      fetchCartData();
      setCartItemErrMsg("");
    } else {
      setCartItemErrMsg(response.data);
    }
    console.log(response.data);
  }

  if (cartItems === null) return;
  return (
    <Flex className={styles.formContainer}>
      <Flex alignItems="center" gap="12px">
        <Text className={styles.titleText}>Cart</Text>
        <Icon as={FaCartShopping} />
      </Flex>
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

      {/* Total  */}
      <Divider marginY="16px" />
      <PriceSummary
        subtotal={cartSubtotal}
        deliveryFee={deliveryFee}
        taxAmount={taxAmount}
      />

      <Text className={styles.warningText}>
        **By clicking the confirm button, you will confirm and place the order
        and will no longer be able to edit the information
      </Text>
    </Flex>
  );
}

function CartItem({ product, removeItemFromCart, modifyCartItemQuantity }) {
  const [cartItemErrMsg, setCartItemErrMsg] = useState("");

  const quantityRef = useRef();
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
          clampValueOnBlur={false}
          onBlur={() =>
            modifyCartItemQuantity(
              product.product_id,
              quantityRef.current.value,
              setCartItemErrMsg
            )
          }
        >
          <NumberInputField ref={quantityRef} height="100%" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>

      <Flex className={styles.bottomSection}>
        <Text className={styles.priceText}>
          ${(product.price * product.quantity).toFixed(2)}
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

const orderItemExample = {
  name: "Apple",
  quantity: 2,
  price: 2.99,
  image_url: "",
};

function Step4Component() {
  return (
    <Flex className={styles.formContainer}>
      <Flex alignItems="center" gap="12px">
        <Text className={styles.titleText} color="#ff914d">
          Order Confirmed!
        </Text>
        <Icon as={FaCircleCheck} color="green" />
      </Flex>
      <Flex gap="8px">
        <Text>Estimated Delivery Time:</Text>
        <Text color="#006C3F">14:30</Text>
      </Flex>
      <Flex className={styles.orderSummaryContainer}>
        <Text fontWeight="bold">Order Summary</Text>
        <Divider />

        {/* Order Items goes here  */}
        <OrderItem item={orderItemExample} />
      </Flex>

      {/* Using dummyTotal  */}
      <PriceSummary
        subtotal={dummyTotal.subtotal}
        deliveryFee={dummyTotal.deliveryFee}
        taxAmount={dummyTotal.taxAmount}
      />
      <Text className={styles.warningText}>
        Paid by card ending in <span>1234</span>
      </Text>
    </Flex>
  );
}

function OrderItem({ item }) {
  return (
    <Flex className={styles.outsideContainer}>
      <Flex className={styles.topSection}>
        <Flex alignItems="center" gap="8px">
          <img className={styles.itemImg} src={item.image_url} />
          <Text>{item.name}</Text>
        </Flex>
        <Text>
          Qty: <span>{item.quantity}</span>
        </Text>
      </Flex>

      <Flex className={styles.bottomSection}>
        <Text className={styles.priceText}>${item.price}</Text>
      </Flex>
    </Flex>
  );
}

const dummyTotal = {
  subtotal: 10.99,
  deliveryFee: 2,
  taxAmount: 1,
};

function PriceSummary({ subtotal, deliveryFee, taxAmount }) {
  return (
    <Flex flexDirection="column">
      <Divider marginY="16px" />
      <Flex justifyContent="space-between" width="100%">
        <Text className={styles.bottomText}>Subtotal</Text>
        <Text className={styles.bottomText}>${subtotal.toFixed(2)}</Text>
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
        <Text className={styles.bottomText}>
          ${(subtotal + deliveryFee + taxAmount).toFixed(2)}
        </Text>
      </Flex>
    </Flex>
  );
}
