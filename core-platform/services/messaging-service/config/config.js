require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || null,
    "database": process.env.DB_NAME || "messaging_app_dev",
    "host": process.env.DB_HOST || "127.0.0.1",
    "port": process.env.DB_PORT || 3306,
    "dialect": "mysql",
    "logging": console.log,
    "pool": {
      "max": 5,
      "min": 0,
      "acquire": 30000,
      "idle": 10000
    }
  },
  "test": {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || null,
    "database": process.env.DB_NAME_TEST || "messaging_app_test",
    "host": process.env.DB_HOST || "127.0.0.1",
    "port": process.env.DB_PORT || 3306,
    "dialect": "mysql",
    "logging": false
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT || 3306,
    "dialect": "mysql",
    "logging": false,
    "pool": {
      "max": 10,
      "min": 2,
      "acquire": 30000,
      "idle": 10000
    }
  }
}
