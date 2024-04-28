const router = require("express").Router();
const { DB } = require("../database");
const { checkLoggedIn, checkIsStaff, validateReqBody } = require("../middleware/authMiddleware");
const { body } = require("express-validator");

router.get("/allProducts", async (req, res) => {
    try {
        let allProducts = await DB.select_all_products();
        return res.status(200).json(allProducts);
    } catch (err) {
        console.log(`ERROR WHEN FETCHING ALL PRODUCTS: ${err}`);
        return res.status(400).send("Something went wrong when fetching store products");
    }
});

router.get("/products/category_name=:categoryName", async (req, res) => {
    try {
        let { categoryName } = req.params;
        let { prods, errMsg } = await DB.get_products_with_category_name(categoryName);
        if (errMsg) return res.status(400).send(errMsg);
        return res.status(200).json(prods);
    } catch (err) {
        console.log(`ERROR WHEN FETCHING PRODUCTS BY CATEGORY NAME: ${err}`);
        return res.status(400).send("Something went wrong when fetching products with specified category_name");
    }
});

router.get("/productInfo/:prodID", checkLoggedIn, async (req, res) => {
    try {
        let product_id = req.params.prodID;
        let { productInfo, errMsg } = await DB.get_product_info(product_id);
        if (errMsg) return res.status(400).send(errMsg);
        return res.status(200).json(productInfo);
    } catch (err) {
        console.log(`ERROR WHEN GETTING PRODUCT INFO: ${err}`);
        return res.status(400).send("Something went wrong when getting product info");
    } 
});

router.get("/allCategories", async (req, res) => {
    try {
        let all_categories = await DB.get_all_categories();
        return res.status(200).json(all_categories);
    } catch (err) {
        console.log(`ERROR WHEN FETCHING ALL CATEGORIES: ${err}`);
        return res.status(400).send("Something went wrong when fetching all product categories");
    }
});

router.post("/addCategory", checkIsStaff, async (req, res) => {
    try {
        let { category_name } = req.body;
        await DB.add_new_category(category_name);
        return res.status(200).send("Successfully added new category");
    } catch (err) {
        console.log(`ERROR WHEN ADDING A CATEGORY: ${err}`);
        return res.status(400).send("Something went wrong when fetching all product categories");
    }
});

router.post("/addProduct", checkIsStaff,
    validateReqBody([
        body("name").notEmpty().withMessage("Missing required product name"),
        body("image_url").notEmpty().withMessage("Missing required image_url"),
        body("price").isFloat({ min: 0.01, max: 100 }).withMessage("Price must be between $0.01 and $100"),
        body("weight").isFloat({ min: 0.1, max: 100 }).withMessage("Weight must be between 0.1 and 100 lbs"),
        body("quantity").isInt({ min: 1, max: 100 }).withMessage("Quantity must be an integer between 1 and 100")
    ]),
    async (req, res) => {
    try {
        let { name, description, image_url, price, weight, quantity, category_ids } = req.body;
        let product_id = await DB.add_new_product(name, description, image_url, price, weight, quantity);
        await DB.set_product_categories(product_id, category_ids);
        return res.status(200).send("Successfully inserted product into database");
    } catch (err) {
        console.log(`ERROR WHEN ADDING PRODUCT: ${err}`);
        if (err.message.includes("UNIQUE constraint failed")) {
            return res.status(400).send(`Product name already exists`);
        }
        return res.status(400).send("Something went wrong when adding a product");
    }
});

router.post("/updateProduct/:prodID", checkIsStaff,
    validateReqBody([
        body("name").notEmpty().withMessage("Missing required product name"),
        body("image_url").notEmpty().withMessage("Missing required image_url"),
        body("price").isFloat({ min: 0.01, max: 100 }).withMessage("Price must be between $0.01 and $100"),
        body("weight").isFloat({ min: 0.1, max: 100 }).withMessage("Weight must be between 0.1 and 100 lbs"),
        body("quantity").isInt({ min: -1, max: 100 }).withMessage("Quantity must be an integer between -1 and 100")
    ]),
    async (req, res) => {
    try {
        let product_id = req.params.prodID;
        // Makes sure product_id actually exists
        let { errMsg } = await DB.get_product_info(product_id);
        if (errMsg) return res.status(400).send(errMsg);
        let { name, description, image_url, price, weight, quantity, category_ids } = req.body;
        await DB.update_product_info(product_id, name, description, image_url, price, weight, quantity);
        await DB.set_product_categories(product_id, category_ids);
        return res.status(200).send("Successfully updated product info");
    } catch (err) {
        console.log(`ERROR WHEN UPDATING PRODUCT: ${err}`);
        if (err.message.includes("UNIQUE constraint failed")) {
            return res.status(400).send(`Product name already exists`);
        }
        return res.status(400).send("Something went wrong when updating the product");
    }
});

module.exports = router;
