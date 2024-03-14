const router = require("express").Router();
const { DB } = require("../database");

// TODO make sure the person calling this is a manager
router.get("/employees", async (req, res) => {
    try {
        let employees = await DB.get_employees();
        return res.status(200).json(employees);
    } catch (err) {
        console.log(`ERROR WHEN GETTING EMPLOYEES: ${err}`);
        return res.status(400).send("Something went wrong when getting employees");
    }
});

module.exports = router;
