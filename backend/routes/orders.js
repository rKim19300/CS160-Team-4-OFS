const router = require("express").Router();
const { DB } = require("../database");
const { checkLoggedIn, checkIsEmployee } = require("../middleware/authMiddleware");

router.post("/placeOrder", checkLoggedIn, async (req, res) => {
    try {
        // TODO: FINISH THIS
        // Don't forget to check product inventory before finalizing order.
        // Don't forget that when an order is placed, we need to subtract from product inventory
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
