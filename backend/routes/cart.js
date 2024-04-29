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
        // get product info and return error message if there was a problem fetching info
        let { productInfo, errMsg } = await DB.get_product_info(product_id);
        if (errMsg) return res.status(400).send(errMsg);
        // check if product out of stock
        if (productInfo.quantity <= 0) return res.status(400).send("Out of stock");
        let cart_id = await DB.get_cart_id(req.user_id);
        // do checks to make sure cart quantity and weight amounts are allowed
        let [isBelowWeightLimit, msg1] = await HelperFuncs.check_cart_will_be_below_weight_limit(cart_id, productInfo, quantity, MAX_CART_WEIGHT, "ADD");
        if (!isBelowWeightLimit) return res.status(400).send(msg1);
        let [isCartLTEinventoryAmt, msg2] = await HelperFuncs.check_cart_quantity_will_be_lte_inventory_amt(cart_id, productInfo, quantity);
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
        // get product info and return error message if there was a problem fetching info
        let { productInfo, errMsg } = await DB.get_product_info(product_id);
        if (errMsg) return res.status(400).send(errMsg);
        // check if product out of stock
        if (productInfo.quantity <= 0) return res.status(400).send("Out of stock");
        let cart_id = await DB.get_cart_id(req.user_id);
        // do checks to make sure cart quantity and weight amounts are allowed
        let [isCartBelowWeightLimit, msg1] = await HelperFuncs.check_cart_will_be_below_weight_limit(cart_id, productInfo, quantity, MAX_CART_WEIGHT, "MODIFY");
        if (!isCartBelowWeightLimit) return res.status(400).send(msg1);
        // since when we are modifying cart quantity, we are directly setting the amount in the cart, we only need to check if the specified `quantity` variable <= inventory amount
        if (quantity > productInfo.quantity) {
            return res.status(400).send(`Maximum quantity allowed in cart: ${productInfo.quantity}`);
        }
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
        let { cartWeight, subtotal_cost, deliveryFee, taxAmount } = await DB.get_cart_summary(cart_id);
        return res.status(200).json({
            cartItems,
            "summary": {
                "cartSubtotalCost": subtotal_cost,
                deliveryFee,
                taxAmount
            }
        });
    } catch (err) {
        console.log(`ERROR VIEWING CART: ${err}`);
        return res.status(400).send("Something went wrong when trying to access the cart");
    }
});

module.exports = router;
