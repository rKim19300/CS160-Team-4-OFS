const router = require("express").Router();
const { DB } = require("../database");
const { body } = require("express-validator");
const { checkLoggedIn, checkIsEmployee, validateReqBody } = require("../middleware/authMiddleware");
const { HelperFuncs } = require("./util/helper_funcs");
const { UserType } = require("../enums/enums");

router.post("/placeOrder", checkLoggedIn,
    validateReqBody([
        body("street_address").notEmpty().withMessage("Missing required street address"),
    ]),
    async (req, res) => {
        try {
            let { street_address } = req.body;
            let cart_id = await DB.get_cart_id(req.user_id);
            let cart_items = await DB.get_cart_items(cart_id);
            if (cart_items.length === 0) return res.status(400).send("There are no items in your cart. Cannot place an order");
            // Compare users cart to product inventory before finalizing order (since inventory can change from when they originally placed the item in their cart).
            let errMsgs = await HelperFuncs.check_all_cart_items_availability(cart_items);
            if (errMsgs.length > 0) return res.status(400).json(errMsgs);
            let { cartWeight, subtotal_cost, deliveryFee, taxAmount, ordered_at } = await HelperFuncs.get_cart_summary(cart_id);
            await DB.add_new_order(req.user_id, subtotal_cost+deliveryFee+taxAmount, cartWeight, street_address, deliveryFee, ordered_at, cart_id);
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
            return res.status(400).send("Something went wrong when trying to place the order");
        }
    }
);

router.get("/allOrders", async (req, res) => {
    try {
        let allOrders = await DB.select_all_orders();
        return res.status(200).json(allOrders);
    } catch (err) {
        console.log(`ERROR WHEN FETCHING ALL ORDERS: ${err}`);
        return res.status(400).send("Something went wrong when fetching all orders");
    }
});

router.get("/getOrderInfo/:order_id", checkLoggedIn, async (req, res) => {
    try {
        let order_id = req.params.order_id;
        let { orderInfo, errMsg } = await DB.get_order_info(order_id);
        if (errMsg) return res.status(400).send(errMsg); // order with order_id does not exist
        // Check to make sure that customers can only see their own orders
        // Employees bypass this rule; they are able to see everything
        let { user_type, user_id } = req.session.user;
        if (user_type === UserType.CUSTOMER && user_id !== orderInfo.user_id) {
            return res.status(401).send("You cannot view this order");
        }
        return res.status(200).json(orderInfo);
    } catch (err) {
        console.log(`ERROR WHEN FETCHING ORDER INFO: ${err}`);
        return res.status(400).send("Something went wrong when fetching order info");
    }
});

router.get("/getOrders", checkLoggedIn, async (req, res) => {
    /* Example return data
        {
            "Ongoing Orders": [
                {order_info},
                {order_info},
                ...
            ],
            "Out For Delivery": [
                {order_info},
                {order_info},
                ...
            ],
            "Order History": [
                {order_info},
                {order_info},
                ...
            ]
        }
    */
    try {
        let orders = await DB.get_user_orders(req.user_id);
        return res.status(200).json(orders);
    } catch (err) {
        console.log(`ERROR WHEN FETCHING USER ORDERS: ${err}`);
        return res.status(400).send("Something went wrong when fetching user orders");
    }
});

module.exports = router;
