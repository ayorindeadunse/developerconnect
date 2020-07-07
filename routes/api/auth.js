const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");

// @route  GET api/auth
// @desc   Test route
// @access Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/auth
// @desc   Authenticate user and get token
// @access Public

router.post(
  "/",
  // check function is used to facilitate custom error messages
  // and rules in valiation. Hence calling .not().isEmpty()
  // to ensure the field is not empty
  [
    // validate e-mail
    check("email", "please include a valid email").isEmail(),
    // validate password
    check("password", "Password is required").exists(),
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
    const { email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }
      // Return jsonwebtoken
      //create payload
      const payload = {
        user: {
          // important to note that mongoose uses an abtraction from the
          // schema to return the _id property in the users collection
          // as id instead
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
