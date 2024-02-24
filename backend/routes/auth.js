const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { DB } = require("../database");
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
        let emailExists = await DB.check_email_exists(email);
        if (emailExists) return res.status(400).send("Email already exists");
        await DB.insert_new_user(email, username, password);
        return res.status(200).send("Successfully signed up");
    } catch (err) {
        return res.status(400).send(`Something went wrong when trying to sign up: ${err}`);
    }
});

router.post("/login", 
    validateReqBody([
        body("email").isLength({ max: email_max_len }).withMessage(`Email length too long. Max character length is ${email_max_len}`),
        body("password").isLength({ min: pw_min_len, max: pw_max_len }).withMessage(`Password must be between ${pw_min_len} and ${pw_max_len} characters`),
    ]),
    async (req, res) => {
    try {
        let { email, password } = req.body;
        let emailExists = await DB.check_email_exists(email);
        if (!emailExists) return res.status(400).send("Invalid credentials");
        let isValidPw = await DB.is_valid_password(email, password);
        if (!isValidPw) return res.status(400).send("Invalid credentials");
        let { user_id, username, is_employee } = await DB.get_user_from_email(email);
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
