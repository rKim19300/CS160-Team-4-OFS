const router = require("express").Router();
const { DB } = require("../database");
const { checkLoggedIn, checkIsEmployee, validateReqBody } = require("../middleware/authMiddleware");
const { HelperFuncs } = require("./util/helper_funcs");
const { body } = require("express-validator");

// Since a delivery robot can only hold 200 lbs per trip, we will set a limit of 100 lbs per order
const MAX_CART_WEIGHT = 100;

router.post(
    "/addItemToCart",
    checkLoggedIn,
    validateReqBody([
        body('quantity').isInt({ min: 1 }).withMessage('Quantity must be an integer greater than or equal to 1')
    ]),
    async (req, res) => {
    try {
        let { product_id, quantity } = req.body;
        quantity = parseInt(quantity);
        let cart_id = await DB.get_cart_id(req.user_id);
        let [isBelowWeightLimit, msg1] = await HelperFuncs.check_cart_will_be_below_weight_limit(cart_id, product_id, quantity, MAX_CART_WEIGHT);
        if (!isBelowWeightLimit) return res.status(400).send(msg1);
        let [isCartLTEinventoryAmt, msg2] = await HelperFuncs.check_cart_quantity_will_be_lte_inventory_amt(cart_id, product_id, quantity);
        if (!isCartLTEinventoryAmt) return res.status(400).send(msg2);

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
        body("quantity").isInt({ min: 1 }).withMessage("Invalid quantity")
    ]),
    async (req, res) => {
    try {
        let { product_id, quantity } = req.body;
        quantity = parseInt(quantity);
        // since when we are modifying cart quantity, we are directly setting the amount in the cart, we only need to check if the specified `quantity` variable <= inventory amount
        let cart_id = await DB.get_cart_id(req.user_id);
        let [isCartBelowWeightLimit, msg1] = await HelperFuncs.check_cart_will_be_below_weight_limit(cart_id, product_id, quantity, MAX_CART_WEIGHT);
        if (!isCartBelowWeightLimit) return res.status(400).send(msg1);
        let [isQuantityLTEinventoryAmt, msg2] = await HelperFuncs.check_quantity_lte_inventory_amt(quantity, product_id);
        if (!isQuantityLTEinventoryAmt) return res.status(400).send(msg2);
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
