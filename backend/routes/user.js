const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const { DB } = require("../database");
const {
  validateReqBody,
  checkLoggedIn,
  checkIsEmployee,
} = require("../middleware/authMiddleware");

const email_max_len = 100;
const uName_min_len = 3;
const uName_max_len = 50;

router.get("/viewUser", checkLoggedIn, async (req, res) => {
  try {
    let userInfo = req.session.user;
    return res.status(200).json(userInfo);
  } catch (err) {
    console.log(`ERROR GETTING USER INFO: ${err}`);
    return res
      .status(400)
      .send("Something went wrong when trying to get user info");
  }
});

router.post(
  "/updateUser",
  checkLoggedIn,
  validateReqBody([
    body("username")
      .isLength({ min: uName_min_len, max: uName_max_len })
      .withMessage(
        `Username must be between ${uName_min_len} and ${uName_max_len} characters`
      ),
    body("email")
      .isLength({ max: email_max_len })
      .isEmail()
      .withMessage("Invalid email"),
  ]),
  async (req, res) => {
    try {
      let user_id = req.user_id;
      let { username, email } = req.body;
      let existingUser = await DB.get_user_from_email(email);
      if (existingUser !== undefined && existingUser.user_id !== user_id)
        return res.status(400).send("Email already exists");
      await DB.update_user_info(user_id, username, email);
      req.session.user = { ...req.session.user, username, email };
      return res.status(200).send("Successfully Updated");
    } catch (err) {
      console.log(`ERROR UPDATING USER INFO: ${err}`);
      return res
        .status(400)
        .send("Something went wrong when trying to update user info");
    }
  }
);
module.exports = router;
