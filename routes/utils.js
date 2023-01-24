const jwt = require("jsonwebtoken");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mydb",
});

const saltRounds = 10;
const secretKey = "muhammad";

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        res.status(403).json({ status: "error", message: err.message });
        return;
      }
      req.decoded = decoded;
      req.token = token;
      next();
    });
  } catch (err) {
    res.status(401).json({ status: "error", message: err.message });
  }
};

module.exports = { jwt, connection, saltRounds, secretKey, verifyToken };
