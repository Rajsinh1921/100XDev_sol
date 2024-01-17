const { JWT_KET } = require("../config");
const jwt = require("jsonwebtoken");

function adminMiddleware(req, res, next) {
  const token = req.headers.authentication;
  const words = token.split(" ");
  const jwtToken = words[1];
  const decodeValue = jwt.verify(jwtToken, JWT_KET);

  if (decodeValue.username) {
    next();
  } else {
    res.status(403).json({ msg: "You are not authentication" });
  }
}

module.exports = adminMiddleware;
