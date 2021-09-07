import jwt from "jsonwebtoken";

export default function (req, res, next) {
  // Get token from header
  // x-auth-token is the key that we want to send the token with
  const token = req.header("x-auth-token");

  // check if no token has arrived
  if (!token) {
    return res.status(401).json({
      msg: "No token, authorization denied",
    });
  }

  // verify the token if there is one
  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      msg: "Token is not valid",
    });
  }
}
