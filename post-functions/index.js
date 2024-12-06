

"use strict";

const express = require("express");
const app = express();
const handler = require("./function/handler");
const bodyParser = require("body-parser");
const authCtrl = require("./function/controllers/auth.controller");
const userCtrl = require("./function/controllers/user.controller");
const postCtrl = require("./function/controllers/post.controller");
const { connectToDatabase } = require("./function/models");
const compression = require('compression')

const defaultMaxSize = "100kb"; // body-parser default

app.disable("x-powered-by");

const rawLimit = process.env.MAX_RAW_SIZE || defaultMaxSize;
const jsonLimit = process.env.MAX_JSON_SIZE || defaultMaxSize;
const cors = require("cors")
app.use(cors({
  origin:["http://localhost:3000" , "http://localhost:8000"]
}));
app.use(function addDefaultContentType(req, res, next) {
  // When no content-type is given, the body element is set to
  // nil, and has been a source of contention for new users.

  if (!req.headers["content-type"]) {
    req.headers["content-type"] = "text/plain";
  }
  next();
});
app.use(compression())

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

const middleware = async (req, res, next) => {
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

  Promise.resolve(handler(fnEvent, fnContext, cb, req, res, next))
    .then((res) => {
      if (!fnContext.cbCalled) {
        fnContext.succeed(res);
      }
    })
    .catch((e) => {
      cb(e);
    });
};

app.get(
  "/posts/feed/:userId",
  authCtrl.requireSignin,
  userCtrl.userByID,
  postCtrl.listNewsFeed
);
app.get(
  "/posts/by/:userId",
  authCtrl.requireSignin,
  userCtrl.userByID,
  postCtrl.listByUser
);
app.post(
  "/posts/new/:userId",
  authCtrl.requireSignin,
  userCtrl.userByID,
  postCtrl.create
);
app.get("/posts/photo/:postId", postCtrl.postByID, postCtrl.create);
app.delete(
  "/posts/:postId",
  authCtrl.requireSignin,
  postCtrl.postByID,
  postCtrl.isPoster,
  postCtrl.remove
);
app.put("/posts/like", authCtrl.requireSignin, postCtrl.like);
app.put("/posts/unlike", authCtrl.requireSignin, postCtrl.unlike);
app.put("/posts/comment", authCtrl.requireSignin, postCtrl.comment);
app.put("/posts/uncomment", authCtrl.requireSignin, postCtrl.uncomment);

const port = process.env.http_port || 3000;

app.listen(port, async () => {
  await connectToDatabase();
  console.log(`node18 listening on port: ${port}`);
});
