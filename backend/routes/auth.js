const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { DB } = require("../database");
const { validateReqBody, checkLoggedIn } = require("../middleware/authMiddleware");
const { UserType } = require("../enums/enums");

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

        let userTypeOfRequester;
        if (req.session.user && (req.session.user.user_type === UserType.MANAGER)) {
            await DB.insert_new_user(email, username, hashedPw, user_type=UserType.EMPLOYEE);
            userTypeOfRequester = UserType.MANAGER;
        }
        else {
            await DB.insert_new_user(email, username, hashedPw);
            userTypeOfRequester = UserType.CUSTOMER;
        }

        return res.status(200).json({
            message: "Successfully signed up",
            userTypeOfRequester: userTypeOfRequester
        });
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
        req.session.user = user
        return res.status(200).json(user);
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
