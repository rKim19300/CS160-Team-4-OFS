const router = require("express").Router();
const { DB } = require("../database");
const { checkLoggedIn, checkIsEmployee } = require("../middleware/authMiddleware");

router.get("/allProducts", async (req, res) => {
    try {
        let allProducts = await DB.select_all_products();
        return res.status(200).json(allProducts);
    } catch (err) {
        console.log(`ERROR WHEN FETCHING ALL PRODUCTS: ${err}`);
        return res.status(400).send("Something went wrong when fetching store products");
    }
});

router.get("/productInfo/:prodID", checkLoggedIn, async (req, res) => {
    try {
        let product_id = req.params.prodID;
        let productInfo = await DB.get_product_info(product_id);
        if (productInfo === undefined) return res.status(400).send(`Product with id ${product_id} does not exist`);
        return res.status(200).json(productInfo);
    } catch (err) {
        console.log(`ERROR WHEN GETTING PRODUCT INFO: ${err}`);
        return res.status(400).send("Something went wrong when getting product info");
    }
});

router.post("/updateProduct/:prodID", checkIsEmployee, async (req, res) => {

});

router.post("/removeProduct/:prodID", checkIsEmployee, async (req, res) => {

});

router.post("/addProduct", checkIsEmployee, async (req, res) => {
    try {
        let { name, description, price, weight, quantity } = req.body;
        await DB.add_new_product(name, description, price, weight, quantity);
        return res.status(200).send("Successfully inserted product into database");
    } catch (err) {
        console.log(`ERROR WHEN ADDING PRODUCT: ${err}`);
        return res.status(400).send("Something went wrong when adding a product");
    }
});

module.exports = router;
