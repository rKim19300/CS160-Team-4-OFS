const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { db } = require("../database");
const { validateReqBody, checkLoggedIn } = require("../middleware/authMiddleware");

const pw_min_len = 1;
const pw_max_len = 128;
const email_max_len = 100;
const uName_min_len = 3;
const uName_max_len = 50;

router.post("/signup",
    validateReqBody([
        body("username").isLength({ min: uName_min_len, max: uName_max_len }).withMessage(`Username must be between ${uName_min_len} and ${uName_max_len} characters`),
        body("password").isLength({ min: pw_min_len, max: pw_max_len }).withMessage(`Password must be between ${pw_min_len} and ${pw_max_len} characters`),
        body("email").isLength({ max: email_max_len }).isEmail().withMessage("Invalid email"),
    ]),
    async (req, res) => {
    try {
        let { username, password, email } = req.body;
        // check if email already exists
        let q = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
        if (q.length > 0) return res.status(400).send("Email already exists");
        // hash password and insert data into db
        let salt = await bcrypt.genSalt();
        let hashedPw = await bcrypt.hash(password, salt);
        await db.query("INSERT INTO Users(username, password, email) VALUES (?, ?, ?)", [username, hashedPw, email]);
        return res.status(200).send("Successfully signed up");
    } catch (err) {
        return res.status(400).send(`Something went wrong when trying to sign up: ${err}`);
    }
});

router.post("/login", 
    validateReqBody([
        body("email").isLength({ max: email_max_len }).isEmail().withMessage("Invalid email"),
        body("password").isLength({ min: pw_min_len, max: pw_max_len }).withMessage(`Password must be between ${pw_min_len} and ${pw_max_len} characters`),
    ]),
    async (req, res) => {
    try {
        let { email, password } = req.body;
        // check to see if username exists in db
        let queryRes = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
        if (queryRes.length === 0) return res.status(400).send("Invalid credentials");
        // check if password is correct
        let { user_id, username, is_employee, password: pw_in_db } = queryRes[0];
        let validPw = await bcrypt.compare(password, pw_in_db);
        if (!validPw) return res.status(400).send("Invalid credentials");
        // set the session
        req.session.user = { user_id, username, email, is_employee };
        return res.status(200).send("Successfully logged in");
    } catch (err) {
        return res.status(400).send(`Something went wrong when trying to log in: ${err}`);
    }
});

router.post("/logout", checkLoggedIn, (req, res) => {
    req.session.destroy();
    res.status(200).send("Successfully logged out");
});

module.exports = router;
