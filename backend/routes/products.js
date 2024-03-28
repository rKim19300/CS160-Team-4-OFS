const router = require("express").Router();
const { DB } = require("../database");
const { checkLoggedIn, checkIsStaff } = require("../middleware/authMiddleware");

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
        let { productInfo, errMsg } = await DB.get_product_info(product_id);
        if (errMsg) return res.status(400).send(errMsg);
        return res.status(200).json(productInfo);
    } catch (err) {
        console.log(`ERROR WHEN GETTING PRODUCT INFO: ${err}`);
        return res.status(400).send("Something went wrong when getting product info");
    }
});

const name_min_len = 1;
const price_min_len = 4;

router.post(
    "/updateProduct/:prodID", 
    checkIsStaff, 
    async (req, res) => {
        try {
            let product_id = req.product_id;
            let { name, price, weight, quantity } = req.body;
            await DB.update_product_info(product_id, name, price, weight, quantity);
            req.session.product = { ...req.session.product, name, price, weight, quantity };
            return res.status(200).send("Successfully Updated");
        } catch (err) {
            console.log(`ERROR UPDATING PRODUCT INFO: ${err}`);
            return res
                .status(400)
                .send("Something went wrong when trying to update product info");
        }
});

//
// router.post("/removeProduct/:prodID", checkIsEmployee, async (req, res) => {
//
// });

router.post("/addProduct", checkIsStaff, async (req, res) => {
    try {
        let { name, description, image_url, price, weight, quantity } = req.body;
        await DB.add_new_product(name, description, image_url, price, weight, quantity);
        return res.status(200).send("Successfully inserted product into database");
    } catch (err) {
        console.log(`ERROR WHEN ADDING PRODUCT: ${err}`);
        return res.status(400).send("Something went wrong when adding a product");
    }
});

module.exports = router;
