var express = require("express");
var cors = require("cors");
var app = express();

app.use(cors());

var bodyParser = require("body-parser");
var jsonPaser = bodyParser.json();
app.use(jsonPaser);
app.use(bodyParser.urlencoded({ extended: true }));

// const mysql = require("mysql2");
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "mydb",
// });

// const bcrypt = require("bcrypt");
// const saltRounds = 10;

// var jwt = require("jsonwebtoken");
// const secretKey = "muhammad";

// app.get("/register", function (req, res, next) {
//   res.json({ msg: "This is CORS-enabled for all origins." });
// });

// app.post("/register-test", jsonPaser, function (req, res, next) {
//   var email = req.body.email;
//   //   res.json({ msg: "Hello..." });
//   res.json({ email });
// });

// app.post("/register", jsonPaser, function (req, res, next) {
//   bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
//     connection.execute(
//       "INSERT INTO users (email, password, fname, lname) VALUES (?, ?, ?, ?)",
//       [req.body.email, hash, req.body.fname, req.body.lname],
//       function (err, results, fields) {
//         if (err) {
//           res.status(400).json({ status: "error", message: err });
//           return;
//         }
//         res.status(201).json({ status: "success" });
//       }
//     );
//   });
// });

// app.post("/login", jsonPaser, function (req, res, next) {
//   connection.execute(
//     "SELECT * FROM users WHERE email=?",
//     [req.body.email],
//     function (err, results, fields) {
//       console.log(results);
//       if (err) {
//         res.status(400).json({ status: "error", message: err });
//         return;
//       }
//       if (results.length === 0) {
//         res.status(400).json({ status: "error", message: "not found user" });
//       } else if (results.length === 1) {
//         bcrypt.compare(
//           req.body.password,
//           results[0].password,
//           function (err, isLogin) {
//             if (isLogin) {
//               var token = jwt.sign({ email: results[0].email }, secretKey, {
//                 expiresIn: "1m",
//               });
//               res.status(200).json({ status: "success", message: "", token });
//             } else {
//               res
//                 .status(400)
//                 .json({ status: "error", message: "login failed" });
//             }
//           }
//         );
//       } else {
//         res.status(400).json({ status: "error", message: "" });
//       }
//     }
//   );
// });

// app.post("/authen", jsonPaser, function (req, res, next) {
//   try {
//     const token = req.headers.authorization.split("Bearer ")[1];
//     console.log(token);
//     var decoded = jwt.verify(token, secretKey);
//     res.status(200).json({ status: "success", token, decoded });
//   } catch (err) {
//     res.status(400).json({ status: "error", message: err.message });
//   }
// });

const authRoute = require("./routes/auth");
app.use("/api/auth", authRoute);
const customerRoute = require("./routes/customer");
app.use("/api/customer", customerRoute);
const orderRoute = require("./routes/order");
app.use("/api/order", orderRoute);

app.listen(3333, function () {
  console.log("CORS-enabled web server listening on port 3333");
});

// start apache and mySQL server with MAMP
// http://localhost/phpMyAdmin/
// create database and table
// npm install express cors
// npm install -g nodemon
// npm install mysql2
// npm install bcrypt
// npm install jsonwebtoken
