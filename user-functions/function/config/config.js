const dotenv = require('dotenv');
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri:"mongodb+srv://akash:1234@cluster0.avud8.mongodb.net/mernproject?retryWrites=true&w=majority&appName=Cluster0"
  //  process.env.MONGODB_URI ||
  //   process.env.MONGO_HOST ||
  //   'mongodb://' + (process.env.IP || 'localhost') + ':' +
  //   (process.env.MONGO_PORT || '27017') 
  //   +
  //   '/mernproject'
};

module.exports = config;
