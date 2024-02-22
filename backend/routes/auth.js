const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { db } = require("../database");
const { validateReqBody, checkLoggedIn } = require("../middleware/authMiddleware");

const USERNAME_ERR_MSG = "Username must be between 3 and 50 characters long";
const PASSWORD_ERR_MSG = "Password must be between 1 and 128 characters long";

router.post("/signup",
    validateReqBody([
        body("username").isLength({ min: 3, max: 50 }).withMessage(USERNAME_ERR_MSG),
        body("password").isLength({ min: 1, max: 128 }).withMessage(PASSWORD_ERR_MSG),
        body("phone_number").isMobilePhone("any").withMessage("Invalid phone number"),
    ]),
    async (req, res) => {
    try {
        let { username, password, phone_number } = req.body;
        // check if username already exists
        let q = await db.query("SELECT * FROM Users WHERE username = ?", [username]);
        if (q.length > 0) return res.status(400).send("User already exists");
        // hash password and insert data into db
        let salt = await bcrypt.genSalt();
        let hashedPw = await bcrypt.hash(password, salt);
        await db.query("INSERT INTO Users(username, password, phone_number) VALUES (?, ?, ?)", [username, hashedPw, phone_number]);
        return res.status(200).send("Successfully signed up");
    } catch (err) {
        return res.status(400).send(`Something went wrong when trying to sign up: ${err}`);
    }
});

router.post("/login", 
    validateReqBody([
        body("username").isLength({ min: 3, max: 50 }).withMessage(USERNAME_ERR_MSG),
        body("password").isLength({ min: 1, max: 128 }).withMessage(PASSWORD_ERR_MSG),
    ]),
    async (req, res) => {
    try {
        let { username, password } = req.body;
        // check to see if username exists in db
        let queryRes = await db.query("SELECT * FROM Users WHERE username = ?", [username]);
        if (queryRes.length === 0) return res.status(400).send("Invalid credentials");
        // check if password is correct
        let { user_id, phone_number, is_employee, password: pw_in_db } = queryRes[0];
        let validPw = await bcrypt.compare(password, pw_in_db);
        if (!validPw) return res.status(400).send("Invalid credentials");
        // set the session
        req.session.user = { user_id, username, phone_number, is_employee };
        return res.status(200).send("Successfully logged in");
    } catch (err) {
        return res.status(400).send(`Something went wrong when trying to log in: ${err}`);
    }
});

router.post("/logout", checkLoggedIn, (req, res) => {
    req.session.destroy();
    res.status(200).send("Successfully logged out");
})

module.exports = router;
