const router = require("express").Router();
const { DB } = require("../database");
const { checkIsLoggedIn, checkIsEmployee } = require("../middleware/authMiddleware");

router.get("/allProducts", async (req, res) => {
    try {
        let allProducts = await DB.select_all_products();
        return res.status(200).json(allProducts);
    } catch (err) {
        console.log(`ERROR WHEN FETCHING ALL PRODUCTS: ${err}`);
        return res.status(400).send("Something went wrong when fetching store products");
    }
});

router.get("/productInfo/:prodID", checkIsLoggedIn, async (req, res) => {

});

router.post("/updateProduct/:prodID", checkIsEmployee, async (req, res) => {

});

router.post("/removeProduct/:prodID", checkIsEmployee, async (req, res) => {

});

router.post("/addProduct", checkIsEmployee, async (req, res) => {

});

module.exports = router;
