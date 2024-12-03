
"use strict";

const express = require("express");
const app = express();
const handler = require("./function/handler");
const bodyParser = require("body-parser");
const authCtrl = require("./function/controllers/auth.controller");
const { connectToDatabase } = require("./function/models");
const defaultMaxSize = "100kb"; // body-parser default
const userCtrl = require("./function/controllers/user.controller");

app.disable("x-powered-by");

const rawLimit = process.env.MAX_RAW_SIZE || defaultMaxSize;
const jsonLimit = process.env.MAX_JSON_SIZE || defaultMaxSize;

app.use(function addDefaultContentType(req, res, next) {
  // When no content-type is given, the body element is set to
  // nil, and has been a source of contention for new users.

  if (!req.headers["content-type"]) {
    req.headers["content-type"] = "text/plain";
  }
  next();
});

if (process.env.RAW_BODY === "true") {
  app.use(bodyParser.raw({ type: "*/*", limit: rawLimit }));
} else {
  app.use(bodyParser.text({ type: "text/*" }));
  app.use(bodyParser.json({ limit: jsonLimit }));
  app.use(bodyParser.urlencoded({ extended: true }));
}

const isArray = (a) => {
  return !!a && a.constructor === Array;
};

const isObject = (a) => {
  return !!a && a.constructor === Object;
};

class FunctionEvent {
  constructor(req) {
    this.body = req.body;
    this.headers = req.headers;
    this.method = req.method;
    this.query = req.query;
    this.path = req.path;
  }
}

class FunctionContext {
  constructor(cb) {
    this.statusCode = 200;
    this.cb = cb;
    this.headerValues = {};
    this.cbCalled = 0;
  }

  status(statusCode) {
    if (!statusCode) {
      return this.statusCode;
    }

    this.statusCode = statusCode;
    return this;
  }

  headers(value) {
    if (!value) {
      return this.headerValues;
    }

    this.headerValues = value;
    return this;
  }

  succeed(value) {
    let err;
    this.cbCalled++;
    this.cb(err, value);
  }

  fail(value) {
    let message;
    if (this.status() == "200") {
      this.status(500);
    }

    this.cbCalled++;
    this.cb(message, value);
  }
}

const middleware = async (req, res) => {
  const cb = (err, functionResult) => {
    if (err) {
      console.error(err);

      return res
        .status(fnContext.status())
        .send(err.toString ? err.toString() : err);
    }

    if (isArray(functionResult) || isObject(functionResult)) {
      res
        .set(fnContext.headers())
        .status(fnContext.status())
        .send(JSON.stringify(functionResult));
    } else {
      res
        .set(fnContext.headers())
        .status(fnContext.status())
        .send(functionResult);
    }
  };

  const fnEvent = new FunctionEvent(req);
  const fnContext = new FunctionContext(cb);

  Promise.resolve(handler(fnEvent, fnContext, cb, req, res))
    .then((res) => {
      if (!fnContext.cbCalled) {
        fnContext.succeed(res);
      }
    })
    .catch((e) => {
      cb(e);
    });
};

// router.param('userId', userCtrl.userByID)

app.route("/users").get(userCtrl.list).post(userCtrl.create);
app.get(
  "/users/photo/:userId",
  userCtrl.userByID,
  userCtrl.photo
  //  userCtrl.defaultPhoto
);
app.put(
  "/users/follow",
  authCtrl.requireSignin,
  userCtrl.addFollowing,
  userCtrl.addFollower
);
app.put(
  "/users/unfollow",
  authCtrl.requireSignin,
  userCtrl.removeFollowing,
  userCtrl.removeFollower
);
app.put(
  "/users/findpeople/:userId",
  userCtrl.userByID,
  authCtrl.requireSignin,
  userCtrl.findPeople
);
app
  .route("/users/:userId")
  .get(userCtrl.userByID, authCtrl.requireSignin, userCtrl.read)
  .put(
    userCtrl.userByID,
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userCtrl.update
  )
  .delete(
    userCtrl.userByID,
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userCtrl.remove
  );

const port = process.env.http_port || 3000;

app.listen(port, async () => {
  console.log(`node18 listening on port: ${port}`);
  await connectToDatabase();
});
