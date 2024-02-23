const router = require("express").Router();
const { DB } = require("../database");
const { checkIsLoggedIn, checkIsEmployee } = require("../middleware/authMiddleware");

router.get("/allProducts", async (req, res) => {
    let allProducts = await DB.select_all_products();
    return allProducts;
});

router.get("/productInfo/:prodID", checkIsLoggedIn, async (req, res) => {

});

router.post("/updateProduct/:prodID", checkIsEmployee, async (req, res) => {

});

module.exports = router;
