const router = require("express").Router();
const { DB } = require("../database");
const { checkIsLoggedIn, checkIsEmployee } = require("../middleware/authMiddleware");

router.post("/addItemToCart", checkIsLoggedIn, async (req, res) => {
    try {
        let { product_id, quantity } = req.body;
        let cart_id = await DB.get_cart_id(req.user_id);
        await DB.insert_item_into_cart(cart_id, product_id, quantity);
        return res.status(200).send("Successfully added item to cart");
    } catch (err) {
        console.log(`ERROR ADDING ITEM TO CART: ${err}`);
        return res.status(400).send("Something went wrong when inserting item to cart");
    }
});

router.post("/removeItemFromCart", checkIsLoggedIn, async (req, res) => {
    try {
        let { product_id } = req.body;
        let cart_id = await DB.get_cart_id(req.user_id);
        await DB.remove_item_from_cart(cart_id, product_id);
        return res.status(200).send("Successfully removed item from cart");
    } catch (err) {
        console.log(`ERROR REMOVING ITEM FROM CART: ${err}`);
        return res.status(400).send("Something went wrong when removing item from cart");
    }
});

router.get("/viewCart", checkIsLoggedIn, async (req, res) => {
    try {
        let cart_id = await DB.get_cart_id(req.user_id);
        let cartItems = await DB.get_cart_items(cart_id);
        return res.status(200).json(cartItems);
    } catch (err) {
        console.log(`ERROR VIEWING CART: ${err}`);
        return res.status(400).send("Something went wrong when trying to access the cart");
    }
});

module.exports = router;
