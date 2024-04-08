const router = require("express").Router();
const { DB } = require("../database");
const { body } = require("express-validator");
const {
  checkLoggedIn,
  checkIsEmployee,
  validateReqBody,
} = require("../middleware/authMiddleware");
const { HelperFuncs } = require("./util/helper_funcs");

router.post(
  "/placeOrder",
  checkLoggedIn,
  validateReqBody([
    body("street_address")
      .notEmpty()
      .withMessage("Missing required street address"),
  ]),
  async (req, res) => {
    try {
      let { street_address } = req.body;
      let cart_id = await DB.get_cart_id(req.user_id);
      let cart_items = await DB.get_cart_items(cart_id);
      if (cart_items.length === 0)
        return res
          .status(400)
          .send("There are no items in your cart. Cannot place an order");
      // Compare users cart to product inventory before finalizing order (since inventory can change from when they originally placed the item in their cart).
      let errMsgs = await HelperFuncs.check_all_cart_items_availability(
        cart_items
      );
      if (errMsgs.length > 0) return res.status(400).json(errMsgs);
      let { cartWeight, subtotal_cost, deliveryFee, taxAmount, ordered_at } =
        await HelperFuncs.get_cart_summary(cart_id);
      await DB.add_new_order(
        req.user_id,
        subtotal_cost + deliveryFee + taxAmount,
        cartWeight,
        street_address,
        deliveryFee,
        ordered_at,
        cart_id
      );
      // make sure to update product inventory. This means subtract from `Products` table the amount of each product that was in the users cart
      for (let cart_item of cart_items) {
        let { product_id, quantity: cartQuantity, name } = cart_item;
        await DB.subtract_product_inventory_quantity(product_id, cartQuantity);
      }
      // lastly, clear the users cart
      await DB.delete_all_cart_items(cart_id);
      return res.status(200).json({
        items: cart_items,
        summary: {
          subtotal_cost,
          deliveryFee,
          taxAmount,
        },
      });
    } catch (err) {
      console.log(`ERROR WHEN PLACING AN ORDER: ${err}`);
      return res
        .status(400)
        .send("Something went wrong when trying to place the order");
    }
  }
);

router.get("/viewMyOrders", checkLoggedIn, async (req, res) => {
  try {
    let orderHistory = await DB.get_user_order_history(req.user_id);
    return res.status(200).json(orderHistory);
  } catch (err) {
    console.log(`ERROR GETTING ORDER HISTORY: ${err}`);
    return res
      .status(400)
      .send("Something went wrong when trying to get order history");
  }
});

router.get("/allOrders", async (req, res) => {
  try {
    let allOrders = await DB.select_all_orders();
    return res.status(200).json(allOrders);
  } catch (err) {
    console.log(`ERROR WHEN FETCHING ALL ORDERS: ${err}`);
    return res
      .status(400)
      .send("Something went wrong when fetching store orders");
  }
});

router.get("/getOrderInfo/:order_id", checkLoggedIn, async (req, res) => {
  try {
    let order_id = req.params.order_id;
    let orders = await DB.get_order_info(order_id);
    let data = {};

    let subtotal = 0;

    for (let order of orders) {
      let productSubtotal = order.quantity * order.price;
      subtotal += productSubtotal;

      if (!data[order.order_id]) {
        data[order.order_id] = {
          order_id: order.order_id,
          cost: order.cost,
          total_weight: order.total_weight,
          address: order.address,
          delivery_fee: order.delivery_fee,
          status: order.status,
          created_at: order.created_at,
          products: [
            {
              product_id: order.product_id,
              quantity: order.quantity,
              name: order.name,
              image_url: order.image_url,
              price: order.price,
              weight: order.weight,
            },
          ],
        };
      } else {
        data[order.order_id].products.push({
          product_id: order.product_id,
          quantity: order.quantity,
          name: order.name,
          image_url: order.image_url,
          price: order.price,
          weight: order.weight,
        });
      }
    }

    let taxAmount = subtotal / 100;

    if (data[order_id]) {
      data[order_id].subtotal = subtotal;
      data[order_id].taxAmount = taxAmount;
    }

    data = data[order_id];
    return res.status(200).json(data);
  } catch (err) {
    console.log(`ERROR WHEN FETCHING ORDERS: ${err}`);
    return res.status(400).send("Something went wrong when fetching orders");
  }
});

router.get("/getOngoingOrders", checkLoggedIn, async (req, res) => {
  try {
    let orders = await DB.get_ongoing_order(req.user_id);
    let data = {};

    for (let order of orders) {
      if (!data[order.order_id]) {
        data[order.order_id] = {
          order_id: order.order_id,
          cost: order.cost,
          created_at: order.created_at,
          delivery_time: order.delivery_time,
          status: order.status,
          image_urls: [order.image_url],
        };
      } else {
        data[order.order_id].image_urls.push(order.image_url);
      }
    }
    data = Object.values(data);
    return res.status(200).json(data);
  } catch (err) {
    console.log(`ERROR WHEN FETCHING ORDERS: ${err}`);
    return res.status(400).send("Something went wrong when fetching orders");
  }
});

router.get("/getOnDeliveryOrders", checkLoggedIn, async (req, res) => {
  try {
    let orders = await DB.get_onDelivery_order(req.user_id);
    let data = {};

    for (let order of orders) {
      if (!data[order.order_id]) {
        data[order.order_id] = {
          order_id: order.order_id,
          cost: order.cost,
          created_at: order.created_at,
          delivery_time: order.delivery_time,
          status: order.status,
          image_urls: [order.image_url],
        };
      } else {
        data[order.order_id].image_urls.push(order.image_url);
      }
    }
    data = Object.values(data);
    return res.status(200).json(data);
  } catch (err) {
    console.log(`ERROR WHEN FETCHING ORDERS: ${err}`);
    return res.status(400).send("Something went wrong when fetching orders");
  }
});

router.get("/getOrderHistory", checkLoggedIn, async (req, res) => {
  try {
    let orders = await DB.get_order_history(req.user_id);
    let data = {};

    for (let order of orders) {
      if (!data[order.order_id]) {
        data[order.order_id] = {
          order_id: order.order_id,
          cost: order.cost,
          created_at: order.created_at,
          delivery_time: order.delivery_time,
          status: order.status,
          image_urls: [order.image_url],
        };
      } else {
        data[order.order_id].image_urls.push(order.image_url);
      }
    }
    data = Object.values(data);
    return res.status(200).json(data);
  } catch (err) {
    console.log(`ERROR WHEN FETCHING ORDERS: ${err}`);
    return res.status(400).send("Something went wrong when fetching orders");
  }
});

module.exports = router;
