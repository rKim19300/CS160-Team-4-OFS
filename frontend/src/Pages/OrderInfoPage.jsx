import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Icon,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { FaBox, FaTruck, FaLocationDot } from "react-icons/fa6";

import styles from "./OrderInfoPage.module.css";
import axiosInstance from "../axiosInstance";

export default function OrderInfoPage({ order_id }) {
  const { id } = useParams();
  const [orderInfo, setOrderInfo] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axiosInstance.get(`/api/getOrderInfo/${id}`);
        if (response.status !== 200) {
            // something went wrong when fetching order info (order DNE or user does not have permission to view order)
            setErrMsg(response.data);
            return;
        }
        setOrderInfo(response.data);
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  if (errMsg.length > 0) return <Flex>{errMsg}</Flex>
  if (orderInfo === null) return <Flex>Loading...</Flex>;

  return (
    <Flex className={styles.container}>
      <Text className={styles.headerText}>Order #{id}</Text>
      <Text className={styles.dateText} color="#707070">
        Placed At: <span>{orderInfo.created_at}</span>
      </Text>

      <Accordion defaultIndex={[0]} allowMultiple paddingY="32px">
        <AccordionItem>
          <AccordionButton>
            <Flex flex="1" textAlign="left" alignItems="center" gap="8px">
              <Icon as={FaTruck} />
              <Text className={styles.accordionHeaderText}>Order Status</Text>
            </Flex>
            <AccordionIcon />
          </AccordionButton>

          {/* TODO: Add Delivery Time */}
          <AccordionPanel>
            {orderInfo.status === 0 ? (
              <>
                <Text>
                  Order Status: <span color="red">Processing</span>
                </Text>
                <Text>Estimated Delivery Time: 14:30</Text>
              </>
            ) : orderInfo.status === 1 ? (
              <>
                <Text>Order Status: Heading To You</Text>
                <Text>Estimated Delivery Time: 14:30</Text>
              </>
            ) : orderInfo.status === 2 ? (
              <>
                <Text>Order Status: Completed</Text>
                <Text>Delivered At: 14:30</Text>
              </>
            ) : (
              <Text>Not Found</Text>
            )}
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton>
            <Flex flex="1" textAlign="left" alignItems="center" gap="8px">
              <Icon as={FaLocationDot} />
              <Text className={styles.accordionHeaderText}>
                Delivery Information
              </Text>
            </Flex>
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel>
            {orderInfo &&
              orderInfo.address &&
              orderInfo.address
                .split(",")
                .map((part, index) => <Text key={index}>{part.trim()}</Text>)}
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton>
            <Flex flex="1" textAlign="left" alignItems="center" gap="8px">
              <Icon as={FaBox} />
              <Text className={styles.accordionHeaderText}>Order Summary</Text>
            </Flex>
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel>
            {orderInfo.products.map((product) => (
              <OrderItem key={product.product_id} item={product} />
            ))}
            <PriceSummary
              subtotal={orderInfo.subtotal}
              deliveryFee={orderInfo.delivery_fee}
              taxAmount={orderInfo.taxAmount}
              cost={orderInfo.cost}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
}

function OrderItem({ item }) {
  return (
    <Flex className={styles.outsideContainer}>
      <Flex className={styles.topSection}>
        <Flex alignItems="center" gap="8px">
          <img className={styles.itemImg} src={item.image_url} />
          <Flex flexDirection="column">
            <Text>{item.name}</Text>
            <Text className={styles.weightText}>{item.weight} lbs</Text>
          </Flex>
        </Flex>
        <Flex flexDirection="column">
          <Text className={styles.weightText}>
            x <span>{item.quantity}</span>
          </Text>
          <Text>${(item.quantity * item.price).toFixed(2)}</Text>
        </Flex>
      </Flex>

      <Flex className={styles.bottomSection}>
        <Text className={styles.priceText}>${item.price.toFixed(2)}</Text>
      </Flex>
    </Flex>
  );
}

function PriceSummary({ subtotal, deliveryFee, taxAmount, cost }) {
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
        <Text className={styles.bottomText}>${cost.toFixed(2)}</Text>
      </Flex>
    </Flex>
  );
}
