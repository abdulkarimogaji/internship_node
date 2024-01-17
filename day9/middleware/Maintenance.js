const config = {
  maintenance: false,
};
module.exports = function (req, res, next) {
  if (config.maintenance == true) {
    return res.status(503).json({
      error: true,
      message: "Server under maintenance",
    });
  }
};
