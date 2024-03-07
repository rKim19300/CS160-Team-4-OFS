const router = require("express").Router();
const { DB } = require("../database");
const { checkLoggedIn, checkIsEmployee, validateReqBody } = require("../middleware/authMiddleware");
const { body } = require("express-validator");

router.post(
    "/addItemToCart",
    checkLoggedIn,
    validateReqBody([
        body('quantity').isInt({ min: 1 }).withMessage('Quantity must be an integer greater than or equal to 1')
    ]),
    async (req, res) => {
    try {
        let { product_id, quantity } = req.body;
        let productInfo = await DB.get_product_info(product_id);
        if (productInfo === undefined) return res.status(400).send(`Product with id ${product_id} does not exist`);
        // TODO: CHECK THAT (productInfo.weight * quantity) IS BELOW THE THRESHOLD
        let cart_id = await DB.get_cart_id(req.user_id);
        // TODO: MAKE SURE THAT AMOUNT OF `product_id` IN USERS CART IS NOT > productInfo.quantity
        await DB.insert_item_into_cart(cart_id, product_id, quantity);
        return res.status(200).send("Successfully added item to cart");
    } catch (err) {
        console.log(`ERROR ADDING ITEM TO CART: ${err}`);
        return res.status(400).send("Something went wrong when inserting item to cart");
    }
});

router.post("/removeItemFromCart", checkLoggedIn, async (req, res) => {
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

router.post(
    "/modifyCartItemQuantity",
    checkLoggedIn,
    validateReqBody([
        body("quantity").isInt({ min: 1 }).withMessage("Quantity must be an integer greater than or equal to 1")
    ]),
    async (req, res) => {
    try {
        let { product_id, quantity } = req.body;
        let cart_id = await DB.get_cart_id(req.user_id);
        await DB.modify_cart_item_quantity(cart_id, product_id, quantity);
        return res.status(200).send("Successfully modified cart item quantity");
    } catch (err) {
        console.log(`ERROR MODIFYING CART ITEM QUANTITY: ${err}`);
        return res.status(400).send("Something went wrong when modifying cart item quantity");
    }
});

router.get("/viewCart", checkLoggedIn, async (req, res) => {
    try {
        let cart_id = await DB.get_cart_id(req.user_id);
        let cartItems = await DB.get_cart_items(cart_id);
        let cartWeight = await DB.get_cart_weight(cart_id);
        let cartSubtotalCost = await DB.get_cart_subtotal_cost(cart_id);
        return res.status(200).json({
            cartItems,
            "summary": {
                cartSubtotalCost,
                "deliveryFee": cartWeight > 20 ? 10 : 0,
                "taxAmount": (cartSubtotalCost / 100)
            }
        });
    } catch (err) {
        console.log(`ERROR VIEWING CART: ${err}`);
        return res.status(400).send("Something went wrong when trying to access the cart");
    }
});

module.exports = router;
