const { TryCatch } = require("./error");

const checkAccess = TryCatch(async (req, res, next) => {
  const route = req.originalUrl.split("/")[2];
  if (req.user.allowedroutes.includes(route) || req.user.role === 'Super Admin') {
    next();
  } else {
    res.status(401).json({
      status: 401,
      success: false,
      message: `You don't have access to ${route} route.`,
    });
  }
});

module.exports = { checkAccess };
