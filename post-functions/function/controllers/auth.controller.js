const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const config = require("../config/config");

const signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(401)
        .fail({
          error: "User not found",
        });
    }

    if (!user.authenticate(req.body.password)) {
      return res.status(401).fail({
        error: "Email and password don't match.",
      });
    }

    const token = jwt.sign({ _id: user._id }, config.jwtSecret);

    res.cookie("t", token, {
      expire: new Date() + 9999,
    });

    return res.succeed({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(401).fail({
      error: "Could not sign in",
    });
  }
};

const signout = (req, res) => {
  // res.clearCookie("t");
  return res.status(200).succeed({
    message: "signed out",
  });
};

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: "auth",
  algorithms: ["HS256"], // Add the algorithm explicitly for compatibility
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!authorized) {
    return res.status(403).succeed({
      error: "User is not authorized",
    });
  }
  next();
};

module.exports = {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
};
