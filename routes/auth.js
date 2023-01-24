const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const {
  verifyToken,
  connection,
  saltRounds,
  jwt,
  secretKey,
} = require("./utils");

router.post("/register", function (req, res, next) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    connection.execute(
      "INSERT INTO users (email, password, fname, lname) VALUES (?, ?, ?, ?)",
      [req.body.email, hash, req.body.fname, req.body.lname],
      function (err, results, fields) {
        if (err) {
          res.status(400).json({ status: "error", message: err });
          return;
        }
        res.status(201).json({ status: "success" });
      }
    );
  });
});

router.post("/login", function (req, res, next) {
  connection.execute(
    "SELECT * FROM users WHERE email=?",
    [req.body.email],
    function (err, results, fields) {
      if (err) {
        res.status(400).json({ status: "error", message: err });
        return;
      }
      if (results.length === 0) {
        res.status(400).json({ status: "error", message: "not found user" });
      } else if (results.length === 1) {
        bcrypt.compare(
          req.body.password,
          results[0].password,
          function (err, isLogin) {
            if (isLogin) {
              var token = jwt.sign({ email: results[0].email }, secretKey, {
                expiresIn: "1m",
              });
              res.status(200).json({ status: "success", message: "", token });
            } else {
              res
                .status(400)
                .json({ status: "error", message: "login failed" });
            }
          }
        );
      } else {
        res.status(400).json({ status: "error", message: "" });
      }
    }
  );
});

// router.post("/authen", function (req, res, next) {
//   try {
//     const token = req.headers.authorization.split("Bearer ")[1];
//     console.log(token);
//     var decoded = jwt.verify(token, secretKey);
//     res.status(200).json({ status: "success", token, decoded });
//   } catch (err) {
//     res.status(400).json({ status: "error", message: err.message });
//   }
// });

router.post("/authen", verifyToken, function (req, res) {
  res
    .status(200)
    .json({ status: "success", token: req.token, decoded: req.decoded });
});

router.post("/user", verifyToken, function (req, res, next) {
  connection.execute(
    "SELECT * FROM users WHERE email=?",
    [req.decoded.email],
    function (err, results, fields) {
      if (err) {
        res.status(400).json({ status: "error", message: err });
        return;
      }
      if (results.length === 0) {
        res.status(400).json({ status: "error", message: "not found user" });
      } else if (results.length === 1) {
        res.status(200).json({
          status: "success",
          data: { ...results[0] },
          message: "",
        });
      } else {
        res.status(400).json({ status: "error", message: "" });
      }
    }
  );
});

module.exports = router;
