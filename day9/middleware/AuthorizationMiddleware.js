const JwtService = require("../services/JwtService");

module.exports = function (req, res, next) {
  const token = JwtService.getToken(req);
  if (!token) {
    return res.status(401).json({
      error: true,
      message: "INVALID_TOKEN",
      code: "INVALID_TOKEN",
    });
  } else {
    const result = JwtService.verifyAccessToken(token);
    if (!result) {
      return res.status(401).json({
        error: true,
        message: "INVALID_TOKEN",
        code: "INVALID_TOKEN",
      });
    }

    req.user_id = result.user_id;
    req.role = result.role;
    next();
  }
};
