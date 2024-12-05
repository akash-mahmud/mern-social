"use strict";
const authCtrl = require("./controllers/auth.controller");
const { connectToDatabase } = require("./models/index");

module.exports = async (event, context, _, req, res) => {
  const method = event.method; // Get the HTTP method
  const path = event.path;
  await connectToDatabase();
  switch (true) {
    case path.includes("/about"):
      if (method === "GET") {
        context
          .headers({ "Content-Type": "text/html" })
          .status(200)
          .succeed("<h1>Hello function with Express template</h1>");
      } else {
        context
          .headers({ "Content-Type": "application/json" })
          .status(200) // Method Not Allowed
          .succeed(event);
      }
      break;
    case path.includes("/sum"):
      try {
        context
          .headers({ "Content-Type": "application/json" })
          .status(200)
          .succeed({
            result: event.query.numbers
              .split(",")
              .map((item) => Number(item))
              .reduce((acc, number) => number + acc),
          });
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
    case path.includes("/signin"):
      switch (method) {
        case "POST":
          try {
            await authCtrl.signin(event, context, req, res);
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

        default:
          context
            .headers({ "Content-Type": "application/json" })
            .status(500)
            .json({
              message: "Unsupoorted request method",
            });
      }

      break;
    case path.includes("/signout"):
      switch (method) {
        case "GET":
          try {
            authCtrl.signout(event, context);
          } catch (error) {
            context
              .headers({ "Content-Type": "application/json" })
              .status(500)
              .json({
                message: "something went wrong",
              });
          }
          break;

        default:
          context
            .headers({ "Content-Type": "application/json" })
            .status(500)
            .json({
              message: "Unsupoorted request method",
            });
          break;
      }

      break;

    default:
      context
        .headers({ "Content-Type": "text/plain" })
        .status(200)
        .succeed("👋 Hello 🌍 World 😀");
  }
};
