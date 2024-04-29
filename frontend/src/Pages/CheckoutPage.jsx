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
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogOverlay,
  useDisclosure,
  HStack
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
import { ErrorMessage } from "formik";

const steps = [
  { title: "Delivery", description: "Enter Address" },
  { title: "Payment", description: "Card Information" },
  { title: "Confirm", description: "Place Order" },
  { title: "Order Confirmation", description: "" },
];

let addressInfo = {};
let addressCoordinates = {};
let streetAddress = '';
let paymentInfo = {};
let orderItems = [];
let orderTotal = {};

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

  // TODO: display the confirmation error
  const [confirmErr, setConfirmErr] = useState(null);
  const handleConfirm = async () => {
    console.log(streetAddress);
    let response = await axiosInstance.post("/api/placeOrder", {
      "street_address": streetAddress,
      "coordinates": addressCoordinates
    });
    if (response.status !== 200) {
      setConfirmErr(response.data);
      console.log(response.data);
      return;
    }
    orderItems = response.data.items;
    orderTotal = response.data.summary;
    console.log("Order has been placed");
    setActiveStep(steps.length - 1);
  };

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
  const [addressLine1, setAddressLine1] = useState(addressInfo["addressLine1"] || "");
  const [addressLine2, setAddressLine2] = useState(addressInfo["addressLine2"] || "");
  const [city, setCity] = useState(addressInfo["city"] || "");
  const [state, setState] = useState(addressInfo["state"] || "");
  const [zipCode, setZipCode] = useState(addressInfo["zipCode"] || "");
  const [errMsg, setErrMsg] = useState("");

  // Hooks for the alert dialogue
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [ isError, setIsError ] = useState(true);
  const [ address, setAddress ] = useState("");

  const submitForm = async (e) => {
    e.preventDefault();

    // Check if the address is valid
    try {
      let response = await axiosInstance.post('/api/validateAddress', {
        addressLine1: addressLine1,
        addressLine2: addressLine2, 
        city: city,
        state: state,
        zipCode: zipCode
      });
      if (response.status != 200) {
        await setErrMsg(response.data);
        await setIsError(true);
        await onOpen();
        return;
      }
      else {
        setAddress(response.data.address);
        addressCoordinates = response.data.coordinates;
        streetAddress = response.data.address;
      }
    }
    catch (err) {
      console.error(err.message);
      await setIsError(true);
      setErrMsg("Oops! Something went wrong on our end, please try again in 60 seconds.");
      await onOpen();
      return;
    }

    // set the addressInfo 
    addressInfo = { addressLine1, addressLine2, city, state, zipCode };

    // set the "activeStep" state of the parent component by calling handleNext
    // If the user confirms their address
    await setIsError(false);
    await onOpen();
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
          <Input type="text" fontSize="16px" required name="addressLine1" value={addressLine1} onChange={e => setAddressLine1(e.target.value)} />

          <FormLabel className={styles.formText}>Address Line 2</FormLabel>
          <Input type="text" fontSize="16px" name="addressLine2" value={addressLine2} onChange={e => setAddressLine2(e.target.value)} />
        </FormControl>

        <Flex justifyContent="space-between" paddingTop="8px">
          <Flex flexDirection="column">
            <FormLabel className={styles.formText}>City</FormLabel>
            <Input type="text" fontSize="16px" required name="city" value={city} onChange={e => setCity(e.target.value)} />
          </Flex>

          <Flex flexDirection="column">
            <FormLabel className={styles.formText}>State</FormLabel>
            <Input type="text" fontSize="16px" required name="state" value={state} onChange={e => setState(e.target.value)} />
          </Flex>

          <Flex flexDirection="column">
            <FormLabel className={styles.formText}>Zip Code</FormLabel>
            <Input type="number" fontSize="16px" required name="zipCode" value={zipCode} onChange={e => setZipCode(e.target.value)} />
          </Flex>
        </Flex>
      </form>
      {/* Alert Dialogue for bad address */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered={true} 
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {(isError) ? "ERROR!" : "Address Confirmation"}
            </AlertDialogHeader>
            <AlertDialogBody>
              {
              (isError) ? 
              errMsg
              : 
              <>
              Please Confirm your address, 
              a small mistake can change the intended location <br/><br/>
                <Box fontWeight="bold">
                  {address}
                </Box>
              </>
              }
            </AlertDialogBody>

            <AlertDialogFooter>
              {(isError) ? <Button colorScheme='red' onClick={onClose} ml={3}>
                              Okay
                            </Button> 
                            :
                            <HStack>
                              <Button colorScheme='green' onClick={handleNext}>
                                Confirm
                              </Button>
                              <Button colorScheme='red' onClick={onClose}>
                              Cancel
                              </Button>
                            </HStack>
                            }
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}

function Step2Component({ handleNext }) {
  const [nameOnCard, setNameOnCard] = useState(paymentInfo["nameOnCard"] || "");
  const [cardNumber, setCardNumber] = useState(paymentInfo["cardNumber"] || "");
  const [exp, setExp] = useState(paymentInfo["exp"] || "");
  const [cvv, setCvv] = useState(paymentInfo["cvv"] || "");
  const [zipCode, setZipCode] = useState(paymentInfo["zipCode"] || "");
  const [errMsg, setErrMsg] = useState("");

  // vars to be used at payment input checks
  let month = new Date().getMonth();
  let year = new Date().getFullYear();

  const submitForm = (e) => {
    e.preventDefault();
    let expYear = "20" + exp.split("/")[1];
    let expMonth = exp.split("/")[0];
    // do payment input checks here
    if (
      // card number checks
      (cardNumber.length == 15 && cardNumber[0] == 3) ||
      (cardNumber.length == 16 && cardNumber[0] == 4 || cardNumber[0] == 5) &&
      // exp date checks
      (expYear > year) ||
      (expYear == year && expMonth > month) &&
      // cvv checks
      (cvv.length == 3) &&
      // zipcode checks
      (zipCode.length == 5)
    ){
      paymentInfo = { nameOnCard, cardNumber, exp, cvv, zipCode }
      // update "activeStep" state in parent component
      handleNext();
    } else {
      alert("Invalid credit card information!");
    }
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
          <Input type="text" fontSize="16px" required name="nameOnCard" value={nameOnCard} onChange={e => setNameOnCard(e.target.value)} />

          <FormLabel className={styles.formText}>Card Number</FormLabel>
          <Input type="number" fontSize="16px" required name="cardNumber" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
        </FormControl>

        <Flex justifyContent="space-between" paddingTop="8px">
          <Flex flexDirection="column">
            <FormLabel className={styles.formText}>Expiry Date</FormLabel>
            <Input type="text" fontSize="16px" required name="exp" value={exp} onChange={e => setExp(e.target.value)} />
          </Flex>

          <Flex flexDirection="column">
            <FormLabel className={styles.formText}>CVV</FormLabel>
            <Input type="number" fontSize="16px" required name="cvv" value={cvv} onChange={e => setCvv(e.target.value)} />
          </Flex>

          <Flex flexDirection="column">
            <FormLabel className={styles.formText}>Zip Code</FormLabel>
            <Input type="number" fontSize="16px" required name="zipCode" value={zipCode} onChange={e => setZipCode(e.target.value)} />
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
        <Text color="#006C3F">Pending...</Text>
      </Flex>
      <Flex className={styles.orderSummaryContainer}>
        <Text fontWeight="bold">Order Summary</Text>
        <Divider />

        {/* Order Items goes here  */}
        {orderItems.map((orderItem, idx) => (
          <OrderItem key={idx} item={orderItem} />
        ))}
      </Flex>

      <PriceSummary
        subtotal={orderTotal.subtotal_cost}
        deliveryFee={orderTotal.deliveryFee}
        taxAmount={orderTotal.taxAmount}
      />
      <Text className={styles.warningText}>
        Paid by card ending in <span>{paymentInfo["cardNumber"].slice(-4)}</span>
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
        <Text className={styles.priceText}>${item.price.toFixed(2)}</Text>
      </Flex>
    </Flex>
  );
}

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
