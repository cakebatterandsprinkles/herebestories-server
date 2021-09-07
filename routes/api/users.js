import bcrypt from "bcryptjs";
import { Router } from "express";
// require express validator to check if the user is sending the data in the requested way
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
// bring in the User model
import auth from "../../middleware/auth.js";
import User from "../../models/User.js";

const router = Router();

// @route  GET api/users
// @desc   Test Route
// @access public
router.get("/", auth, async (req, res) => {
  try {
    // we want to get the req.user that is passed from the auth.js, but we don't want to get the password.
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  POST api/users
// @desc   Register User
// @access public
router.post(
  "/",
  [
    check("username", "Error: User name is required").not().isEmpty(),
    check("email", "Please enter a valid e-mail address").isEmail(),
    check(
      "password",
      "Please enter a password with 8 or more characters"
    ).isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    // check if there are errors, and return a proper response
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, username, password } = req.body;

    try {
      // See if the user exists
      let user = await User.findOne({
        email: email,
      });
      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg: "User already exists",
            },
          ],
        });
      }

      // create a new User instance
      user = new User({
        email,
        username,
        password,
      });

      // Encrypt password
      // create a salt to do the hashing with (documentation recommends at least 10)
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      // save the new user
      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWTSECRET,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

export default router;
