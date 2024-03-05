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
        let existingUser = await DB.get_user_from_email(email);
        if (existingUser !== undefined) return res.status(400).send("Email already exists");
        let salt = await bcrypt.genSalt();
        let hashedPw = await bcrypt.hash(password, salt);
        await DB.insert_new_user(email, username, hashedPw);
        return res.status(200).send("Successfully signed up");
    } catch (err) {
        console.log(`ERROR SIGNING UP: ${err}`);
        return res.status(400).send(`Something went wrong when trying to sign up`);
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
        let user = await DB.get_user_from_email(email);
        if (user === undefined) return res.status(401).send("Invalid credentials");
        let pw_in_db = await DB.get_stored_password(email);
        let isValidPw = await bcrypt.compare(password, pw_in_db);
        if (!isValidPw) return res.status(401).send("Invalid Credentials");
        let { user_id, username, user_type } = user;
        req.session.user = { user_id, username, email, user_type };
        return res.status(200).send("Successfully logged in");
    } catch (err) {
        console.log(`ERROR LOGGING IN: ${err}`);
        return res.status(400).send(`Something went wrong when trying to log in`);
    }
});

router.post("/logout", checkLoggedIn, (req, res) => {
    req.session.destroy();
    res.status(200).send("Successfully logged out");
});

module.exports = router;
