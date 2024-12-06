const dotenv = require("dotenv");
dotenv.config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri:
    "mongodb+srv://abdallahimadhassan:V1D6MBxSW3NxqUyf@openfaas.xq2dc.mongodb.net/?retryWrites=true&w=majority&appName=OpenFaaS",
  //  process.env.MONGODB_URI ||
  //   process.env.MONGO_HOST ||
  //   'mongodb://' + (process.env.IP || 'localhost') + ':' +
  //   (process.env.MONGO_PORT || '27017')
  //   +
  //   '/mernproject'
};

module.exports = config;
