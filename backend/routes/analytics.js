const router = require("express").Router();
const { DB } = require("../database");

// TODO verify that the person is LoggedIn and is a Manager
router.get("/weekRevenue", async (req, res) => {
    try {
        let weekRevenue = await DB.get_week_revenue();
        return res.status(200).json(weekRevenue);
    } catch (err) {
        console.log(`ERROR WHEN GETTING WEEK REVENUE: ${err}`);
        return res.status(400).send("Something went wrong when getting this week's revenue");
    }
});

module.exports = router;
