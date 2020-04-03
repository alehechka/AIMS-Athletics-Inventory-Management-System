const jwt = require("jsonwebtoken");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const { PRIVATE_KEY } = process.env;

module.exports = function(roles) {
  return function(req, res, next) {
    //get the token from the header if present
    const token = req.cookies["x-access-token"];
    //if no token found, return response (without going to the next middelware)
    if (!token)
      return res.status(401).send("Access denied. No token provided.");

    try {
      //if can verify the token, set req.user and pass to next middleware
      const decoded = jwt.verify(token, PRIVATE_KEY);
      decoded.highestAccess = {};
      if(decoded.isAdmin) {
        decoded.highestAccess.isAdmin = true;
      } else if (decoded.isEmployee) {
        decoded.highestAccess.isEmployee = true;
      } else if (decoded.isCoach) {
        decoded.highestAccess.isCoach = true;
      } else if (decoded.isAthlete) {
        decoded.highestAccess.isAthlete = true;
      }
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
        .clearCookie("x-access-token")
        .send("Invalid token.");
    }
  };
};
