import React, { useState, useEffect } from "react";
import { Flex, Text, Divider, Grid, GridItem } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import styles from "./CustomerOrders.module.css";
import axiosInstance from "../axiosInstance";

export default function CustomerOrders() {
  const [ongoingOrders, setOngoingOrders] = useState(null);
  const [onDeliveryOrders, setOnDeliveryOrders] = useState(null);
  const [orderHistory, setOrderHistory] = useState(null);

  async function fetchOrders() {
    let ordersResponse = await axiosInstance.get("/api/getOrders");
    let userOrders = ordersResponse.data;
    setOngoingOrders(userOrders["Ongoing Orders"]);
    setOnDeliveryOrders(userOrders["Out For Delivery"]);
    setOrderHistory(userOrders["Order History"]);
    console.log(userOrders);
  }

  useEffect(() => {
    try {
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  }, []);

  if (ongoingOrders === null) return <Flex>Loading...</Flex>;

  return (
    <Flex className={styles.container}>
      <Text className={styles.statusText} color="#ff914d">
        Ongoing Orders
      </Text>
      {ongoingOrders.length === 0 ? (
        <Text className={styles.messageText}>
          There is Currently No Ongoing Order
        </Text>
      ) : (
        ongoingOrders.map((order) => <OrderComponent order={order} />)
      )}
      <Text className={styles.statusText} color="#FFBD59">
        Out For Delivery
      </Text>
      {onDeliveryOrders.length === 0 ? (
        <Text className={styles.messageText}>
          There is Currently No Order Out For Delivery
        </Text>
      ) : (
        onDeliveryOrders.map((order) => <OrderComponent order={order} />)
      )}

      <Text className={styles.statusText} color="#006c3f">
        Order History
      </Text>

      {orderHistory.length === 0 ? (
        <Text className={styles.messageText}>
          There is Currently No Order History
        </Text>
      ) : (
        orderHistory.map((order) => <OrderComponent order={order} />)
      )}
    </Flex>
  );
}

function OrderComponent({ order }) {
  return (
    <Link
      className={styles.orderContainer}
      to={`/customer/info/${order.order_id}`}
    >
      <Grid className={styles.grid}>
        <GridItem>
          <Text className={styles.infoText}>Order #</Text>
          <Text>{order.order_id}</Text>
        </GridItem>
        <GridItem>
          <Text className={styles.infoText}>Order Placed</Text>
          <Text>{order.created_at}</Text>
        </GridItem>
        {order.status === 2 ? (
          <GridItem>
            <Text className={styles.infoText}>Delivered At</Text>
            <Text>15:30</Text>
          </GridItem>
        ) : (
          <GridItem>
            <Text className={styles.infoText}>Estimated Delivery Time</Text>
            <Text>15:00 - 18:00</Text>
          </GridItem>
        )}
        <GridItem>
          <Text className={styles.infoText}>Order Status</Text>
          {order.status === 0 ? (
            <Text>Processing</Text>
          ) : order.status === 1 ? (
            <Text>En Route</Text>
          ) : order.status === 2 ? (
            <Text>Delivered</Text>
          ) : (
            <Text>Not Found</Text>
          )}
        </GridItem>
      </Grid>
      <Divider />

      <Flex className={styles.orderProducts}>
        <Flex gap="8px">
          {order.image_urls.map((url) => (
            <img className={styles.itemImg} src={url} />
          ))}
        </Flex>
        <Flex gap="10px" width="10%" alignItems="start">
          <Text fontWeight="bold">Total</Text>
          <Text>${order.cost.toFixed(2)}</Text>
        </Flex>
      </Flex>
    </Link>
  );
}
