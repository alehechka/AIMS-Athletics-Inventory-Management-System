const jwt = require("jsonwebtoken");

require("mandatoryenv").load(["PRIVATE_KEY"]);
const { PRIVATE_KEY } = process.env;

module.exports = function(req, res, next) {
  //get the token from the header if present
  const token = req.cookies["authorization"];
  //if no token found, return response (without going to the next middelware)
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    //if invalid token
    res
      .status(400)
      .cookie("authorization", null, { expires: new Date() })
      .send("Invalid token.");
  }
};
