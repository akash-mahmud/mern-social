const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compress = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const Template = require("./template");
const compression = require('compression')

// modules for server-side rendering
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const MainRouter = require("./client/MainRouter").default;
const { StaticRouter } = require("react-router-dom");
const { ServerStyleSheets, ThemeProvider } = require("@material-ui/styles");
const theme = require("./client/theme").default;
// end

// comment out before building for production

const CURRENT_WORKING_DIR = process.cwd();
const app = express();

// enable CORS - Cross Origin Resource Sharing
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



// parse body params and attach them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());

// secure apps by setting various HTTP headers
app.use(helmet());
app.use(compression())

// serve static files
app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")));

app.get("*", (req, res) => {
  const sheets = new ServerStyleSheets();

  const context = {};
  const markup = ReactDOMServer.renderToString(
    sheets.collect(
      React.createElement(
        StaticRouter,
        { location: req.url, context: context },
        React.createElement(
          ThemeProvider,
          { theme: theme },
          React.createElement(MainRouter)
        )
      )
    )
  );

  if (context.url) {
    return res.redirect(303, context.url);
  }

  const css = sheets.toString();
  res.status(200).send(
    Template({
      markup: markup,
      css: css,
    })
  );
});

// Catch unauthorized errors
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    console.log(err);
    
    res.status(400).json({ error: err.name + ": " + err.message });
    console.error(err);
  }
});



const port = process.env.http_port || 3000;

app.listen(port, () => {
  console.log(`node18 listening on port: ${port}`);
});
