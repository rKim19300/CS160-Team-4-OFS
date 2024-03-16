const router = require("express").Router();
const { DB } = require("../database");
const { checkLoggedIn, checkIsEmployee } = require("../middleware/authMiddleware");
const { HelperFuncs } = require("./util/helper_funcs");

router.post("/placeOrder", checkLoggedIn, async (req, res) => {
    // TODO: STILL NEED TO TEST THIS
    try {
        let { street_address } = req.body;
        let cart_id = await DB.get_cart_id(req.user_id);
        let cart_items = await DB.get_cart_items(cart_id);
        // Compare users cart to product inventory before finalizing order (since inventory can change from when they originally placed the item in their cart).
        let errMsgs = await HelperFuncs.check_all_cart_items_availability(cart_items);
        if (errMsgs.length > 0) return res.status(400).json(errMsgs);
        let { cartWeight, subtotal_cost, deliveryFee, taxAmount, ordered_at } = await HelperFuncs.get_cart_summary(cart_id);
        await DB.add_new_order(req.user_id, subtotal_cost+deliveryFee+taxAmount, cart_weight, street_address, deliveryFee, ordered_at, cart_id);
        // make sure to update product inventory. This means subtract from `Products` table the amount of each product that was in the users cart
        for (let cart_item of cart_items) {
            let { product_id, quantity: cartQuantity, name } = cart_item;
            await DB.subtract_product_inventory_quantity(product_id, cartQuantity);
        }
        // lastly, clear the users cart
        await DB.delete_all_cart_items(cart_id);
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

module.exports = router;
