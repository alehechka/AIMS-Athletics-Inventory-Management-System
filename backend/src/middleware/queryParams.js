const url = require("url");

module.exports = function(required, optional) {
  return function(req, res, next) {
    let query = url.parse(req.url, true).query;
    for (let param of required) {
      if (!query[param]) {
        return res.status(400).json({ 
            message: `Missing required parameter: ${param}`,
            required,
            optional
        });
      }
    }
    req.query = query;
    return next();
  };
};
