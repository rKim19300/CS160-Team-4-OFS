const router = require("express").Router();
const { DB } = require("../database");
const { checkLoggedIn, checkIsStaff } = require("../middleware/authMiddleware");

router.post("/placeOrder", checkLoggedIn, async (req, res) => {
    try {
        // TODO: FINISH THIS
        // Don't forget that when an order is placed, we need to subtract from product inventory
        let { addressInfo } = req.body;
        // iterate over all items in cart and make sure the quantity is within the quantity in inventory
        let cart_id = await DB.get_cart_id(req.user_id);

        // Don't forget to check product inventory before finalizing order.
        // TODO: WILL PROBABLY NEED TO CHANGE THIS
        // let cart_items = await DB.get_cart_items(cart_id);
        // let errMsgs = [];
        // for (let ci of cart_items) {
        //     let { product_id, quantity: cartQuantity, name } = ci;
        //     let productInfo = await DB.get_product_info(product_id);
        //     if (cartQuantity > productInfo["quantity"]) {
        //         errMsgs.push(`${name} current has an inventory count of ${productInfo["quantity"]}, which is less than ${cartQuantity}`);
        //     }
        // }
        // if (errMsgs.length > 0) return res.status(400).json(errMsgs);

        let order_weight = await DB.get_cart_weight(cart_id);
        let subtotal_cost = await DB.get_cart_subtotal_cost(cart_id);
        let delivery_fee = order_weight < 20 ? 0 : 10;
        let taxAmount = subtotal_cost / 100;
        let ordered_at = new Date().toLocaleString().replace(",", "");
        await DB.add_new_order(req.user_id, subtotal_cost+delivery_fee+taxAmount, order_weight, ADDRESS, delivery_fee, ordered_at, cart_id);
        await DB.delete_all_cart_items(cart_id);
        // make sure to update product inventory
        
    } catch (err) {
        console.log(`ERROR WHEN PLACING AN ORDER: ${err}`);
        return res.status(400).send("Something went wrong when trying to place the order");
    }
});

router.get("/viewMyOrders", checkLoggedIn, async (req, res) => {
    try {
        let orderHistory = await DB.get_user_order_history(req.user_id);
        return res.status(200).json(orderHistory);
    } catch (err) {
        console.log(`ERROR GETTING ORDER HISTORY: ${err}`);
        return res.status(400).send("Something went wrong when trying to get order history");
    }
});

router.get("/allOrders", async (req, res) => {
    try {
        let allOrders = await DB.select_all_orders();
        return res.status(200).json(allOrders);
    } catch (err) {
        console.log(`ERROR WHEN FETCHING ALL ORDERS: ${err}`);
        return res.status(400).send("Something went wrong when fetching store orders");
    }
});

module.exports = router;
