import bcrypt from "bcryptjs";
import { Router } from "express";
// require express validator to check if the user is sending the data in the requested way
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

const router = Router();

// @route  POST api/auth
// @desc   Authenticate User & Get token
// @access public
router.post(
  "/",
  [
    check("email", "E-mail is required").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    //check if there are errors, and return a proper response
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      // See if the user exists
      let user = await User.findOne({
        email: email,
      });
      if (!user) {
        return res.status(401).json({
          errors: [
            {
              msg: "Invalid credentials",
            },
          ],
        });
      }

      // bcrypt has a method called compare which takes a plain text password
      // and compares it with the encrypted password, tells you if it's a match or not.
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          errors: [
            {
              msg: "Invalid credentials",
            },
          ],
        });
      }

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
            token: token,
            id: user.id,
            email: email,
            username: user.username,
            avatar: user.avatar,
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
