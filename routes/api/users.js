const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
// @route  POST api/users
// @desc   Register user
// @access Public
router.post(
  "/",
  // check function is used to facilitate custom error messages
  // and rules in valiation. Hence calling .not().isEmpty()
  // to ensure the field is not empty
  [
    check("name", "Name is required").not().isEmpty(),
    // validate e-mail
    check("email", "please include a valid email").isEmail(),
    // validate password
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    // result of validation in validationResult
    const errors = validationResult(req);
    // if there are errors (i.e bad request)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // destructuring technique to get name, email and body instead
    // of repeatedly doing req.body
    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        //default size
        s: "200",
        //rating
        r: "pg",
        //default (a default image)
        d: "mm",
      });

      //creates new instance of user
      user = new User({
        name,
        email,
        avatar,
        password,
      });
      // Encrypt password
      // creat salt
      const salt = await bcrypt.genSalt(10);
      //hash password
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      // Return jsonwebtoken

      res.send("User Registered!");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
