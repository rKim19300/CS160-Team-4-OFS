const router = require("express").Router();
const { DB } = require("../database");
const { checkLoggedIn, checkIsManager } = require("../middleware/authMiddleware");


router.get("/weekRevenue", checkLoggedIn, checkIsManager, async (req, res) => {
    try {
        let weekRevenue = await DB.get_week_revenue();
        return res.status(200).json(weekRevenue);
    } catch (err) {
        console.log(`ERROR WHEN GETTING WEEK REVENUE: ${err}`);
        return res.status(400).send("Something went wrong when getting this week's revenue");
    }
});

router.get("/monthRevenue", checkLoggedIn, checkIsManager, async (req, res) => {
    try {
        let monthRevenue = await DB.get_month_revenue();
        return res.status(200).json(monthRevenue);
    } catch (err) {
        console.log(`ERROR WHEN GETTING MONTH REVENUE: ${err}`);
        return res.status(400).send("Something went wrong when getting month revenue");
    }
});

router.get("/yearRevenue", checkLoggedIn, checkIsManager, async (req, res) => {
    try {
        let yearRevenue = await DB.get_year_revenue();
        return res.status(200).json(yearRevenue);
    } catch (err) {
        console.log(`ERROR WHEN GETTING YEAR REVENUE: ${err}`);
        return res.status(400).send("Something went wrong when getting year revenue");
    }
});

module.exports = router;
