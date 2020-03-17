const jwt = require("jsonwebtoken");

require("mandatoryenv").load(["PRIVATE_KEY"]);
const { PRIVATE_KEY } = process.env;

module.exports = function(roles) {
  return function(req, res, next) {
    //get the token from the header if present
    const token = req.cookies["authorization"];
    //if no token found, return response (without going to the next middelware)
    if (!token)
      return res.status(401).send("Access denied. No token provided.");

    try {
      //if can verify the token, set req.user and pass to next middleware
      const decoded = jwt.verify(token, PRIVATE_KEY);
      if (roles) {
        for (let role of roles) {
          if (decoded[role]) {
            req.user = decoded;
            return next();
          }
        }
        return res.status(401).send("Unauthorized to perform this action.");
      } else {
        req.user = decoded;
        return next();
      }
    } catch (ex) {
      //if invalid token
      return res
        .status(400)
        .clearCookie("authorization")
        .send("Invalid token.");
    }
  };
};
