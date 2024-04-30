const router = require("express").Router();
const { DB } = require("../database");
const { checkIsManager } = require("../middleware/authMiddleware");
const { UserType } = require("../enums/enums");

router.get("/employees", checkIsManager, async (req, res) => {
    try {
        let employees = await DB.get_employees();
        return res.status(200).json(employees);
    } catch (err) {
        console.log(`ERROR WHEN GETTING EMPLOYEES: ${err}`);
        return res.status(400).send("Something went wrong when getting employees");
    }
});

// Remove Employee
router.post('/removeEmployee', checkIsManager, async (req, res) => {
    try { 
        let { user_id } = req.body;
        await DB.remove_user_by_id(user_id);
        return res.status(200).send("Employee removal successful");
    }
    catch (err) {
        console.log(`ERROR Removing Employee: ${err}`);
        return res.status(400).send(`Something went wrong when trying to Remove employee`);
    }
});

module.exports = router;
