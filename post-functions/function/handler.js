"use strict";
const { httpMethods } = require("./constants");
const postCtrl = require("./controllers/post.controller");
const authCtrl = require("./controllers/auth.controller");
const { connectToDatabase } = require("./models/index");

module.exports = async (event, context, _, req, res, next) => {
  const method = event.method; // Get the HTTP method
  const path = event.path;
  await connectToDatabase();

  switch (path) {
    case "/like":
      if (method === httpMethods.PUT) {
        await postCtrl.like(event, context);
      } else {
        context
          .headers({ "Content-Type": "application/json" })
          .status(500)
          .json({
            message: "😡 Bad method: Method is not allowed",
          });
      }
      break;
    case "/unlike":
      try {
        if (method === httpMethods.PUT) {
          await authCtrl.requireSignin(req, res, next);
          await postCtrl.unlike(event, context);
        } else {
          context
            .headers({ "Content-Type": "application/json" })
            .status(200) // Method Not Allowed
            .succeed(event);
        }
      } catch (error) {
        context
          .headers({ "Content-Type": "application/json" })
          .status(500)
          .json({
            message:
              "😡 Bad query: write something like that: hello/sum?numbers=10,20,12",
          });
      }
      break;
    case "/comment":
      switch (method) {
        case httpMethods.PUT:
          try {
            await authCtrl.requireSignin(req, res, next);
            await postCtrl.comment(event, context);
          } catch (error) {
            context
              .headers({ "Content-Type": "application/json" })
              .status(500)
              .json({
                message:
                  "😡 Bad query: write something like that: hello/sum?numbers=10,20,12",
              });
          }
          break;
        case "/uncomment":
          switch (method) {
            case httpMethods.PUT:
              await authCtrl.requireSignin(req, res, next);
              await postCtrl.uncomment(event, context);
              break;

            default:
              break;
          }
          break;
        default:
          context
            .headers({ "Content-Type": "application/json" })
            .status(500)
            .json({
              message: "Unsupoorted request method",
            });
      }

      break;
    default:
      switch (true) {
        case path.includes("/posts/by"):
          if (method === httpMethods.GET) {
            await postCtrl.listByUser(event, context, _, req, res, next);
          }
          break;
        case path.includes("/posts/new"):
          if (method === httpMethods.POST) {
            await postCtrl.create(event, context, _, req, res, next);
          }
          break;
        case path.includes("/posts/feed"):
          if (method === httpMethods.GET) {
            await postCtrl.listNewsFeed(event, context, _, req, res, next);
          }
          break;
        case path.includes("/posts/photo"):
          if (method === httpMethods.GET) {
            await postCtrl.photo(event, context, _, req, res, next);
          }
          break;
        case path.includes("/posts/"):
          if (method === httpMethods.DELETE) {
          }
          break;
        default:
          context
            .headers({ "Content-Type": "text/plain" })
            .status(200)
            .succeed("👋 Hello 🌍 World 😀");
          break;
      }
  }
};
