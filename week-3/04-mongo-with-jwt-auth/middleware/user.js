const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config");

function userMiddleware(req, res, next) {
  const token = req.headers.authentication;
  const words = token.split(" ");
  const jwtToken = words[1];
  const decodeValue = jwt.verify(jwtToken, JWT_KEY);

  if (decodeValue.username) {
    req.username = decodeValue.username;
    next();
  } else {
    res.status(404).json({
      msg: "You are not authentication",
    });
  }
}

module.exports = userMiddleware;
