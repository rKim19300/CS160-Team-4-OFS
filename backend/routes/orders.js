const router = require("express").Router();
const { DB } = require("../database");
const { body } = require("express-validator");
const { checkLoggedIn, checkIsStaff, validateReqBody } = require("../middleware/authMiddleware");
const { HelperFuncs } = require("./util/helper_funcs");
const { SocketRoom } = require("../enums/enums");

router.post("/placeOrder",
    checkLoggedIn,
    validateReqBody([
        body("street_address").notEmpty().withMessage("Missing required street address")
    ]),
    async (req, res) => {
    try {
        let { street_address, coordinates } = req.body;
        let cart_id = await DB.get_cart_id(req.user_id);
        let cart_items = await DB.get_cart_items(cart_id);
        if (cart_items.length === 0) return res.status(400).send("There are no items in your cart. Cannot place an order");

        // Compare users cart to product inventory before finalizing order (since inventory can change from when they originally placed the item in their cart).
        let errMsgs = await HelperFuncs.check_all_cart_items_availability(cart_items);
        if (errMsgs.length > 0) return res.status(400).json(errMsgs);
        let { cartWeight, subtotal_cost, deliveryFee, taxAmount, ordered_at } = await HelperFuncs.get_cart_summary(cart_id);
        await DB.add_new_order(req.user_id, subtotal_cost+deliveryFee+taxAmount, cartWeight, street_address, deliveryFee, ordered_at, cart_id, coordinates.lat, coordinates.lng);

        // make sure to update product inventory. This means subtract from `Products` table the amount of each product that was in the users cart
        for (let cart_item of cart_items) {
            let { product_id, quantity: cartQuantity, name } = cart_item;
            await DB.subtract_product_inventory_quantity(product_id, cartQuantity);
        }
        // lastly, clear the users cart
        await DB.delete_all_cart_items(cart_id);

        // Update the OrdersMap 
        let staffIO = req.app.get('staffIO');
        staffIO.to(SocketRoom.STAFF_ROOM).emit('updateOrders', coordinates); // Emit to all in room
        staffIO.emit('updateOrders', coordinates); // TODO this line is not needed in production

        return res.status(200).json({
            "items": cart_items,
            "summary": {
                subtotal_cost,
                deliveryFee,
                taxAmount
            }
        });
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

router.get('/unfinishedOrders', checkIsStaff, async (req, res) => {
    try {
        let unfinishedOrders = await DB.get_unfinished_orders();
        console.log(JSON.stringify(unfinishedOrders));
        return res.status(200).json(unfinishedOrders);
    }
    catch (err) {
        console.log(`ERROR WHEN FETCHING UNFINISHED ORDERS: ${err}`);
        return res.status(400).send("Something went wrong when fetching store orders");
    }
});

module.exports = router;
