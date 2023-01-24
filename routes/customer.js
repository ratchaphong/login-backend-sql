const express = require("express");
const { verifyToken, connection } = require("./utils");
const router = express.Router();

router.get("/", verifyToken, function (req, res, next) {
  connection.execute(
    "SELECT * FROM customers",
    function (err, results, fields) {
      if (err) {
        res.status(400).json({ status: "error", message: err });
        return;
      }
      res.status(200).json({
        status: "success",
        data: results,
      });
    }
  );
});

router.get("/query", verifyToken, function (req, res, next) {
  connection.execute(
    // "SELECT * FROM customers WHERE id=?",
    `SELECT id, name, age, address FROM ${req.query.table} ORDER BY ${req.query.column} ${req.query.orderBy}`,
    function (err, results, fields) {
      if (err) {
        res.status(400).json({ status: "error", message: err });
        return;
      }
      res.status(200).json({
        status: "success",
        data: results,
      });
    }
  );
});

router.get("/searchById", verifyToken, function (req, res, next) {
  connection.execute(
    `SELECT id, name, age, address FROM customers WHERE id=?`,
    [req.query.id],
    function (err, results, fields) {
      if (err) {
        res.status(400).json({ status: "error", message: err });
        return;
      }
      res.status(200).json({
        status: "success",
        data: results,
      });
    }
  );
});

router.get("/:id", verifyToken, function (req, res, next) {
  connection.execute(
    // "SELECT * FROM customers WHERE id=?",
    "SELECT id, name, age, address FROM customers WHERE id=?",
    [req.params.id],
    function (err, results, fields) {
      if (err) {
        res.status(400).json({ status: "error", message: err });
        return;
      }
      res.status(200).json({
        status: "success",
        data: { ...results[0] },
      });
    }
  );
});

router.post("/", verifyToken, function (req, res, next) {
  connection.execute(
    "INSERT INTO customers (name, age, address, salary) VALUES (?, ?, ?, ?)",
    [req.body.name, req.body.age, req.body.address, req.body.salary],
    function (err, results, fields) {
      if (err) {
        res.status(400).json({ status: "error", message: err });
        return;
      }
      res.status(201).json({ status: "success" });
    }
  );
});

router.put("/", verifyToken, function (req, res, next) {
  connection.execute(
    "UPDATE customers SET salary=? WHERE id=?",
    [req.body.salary, req.body.id],
    function (err, results, fields) {
      if (err) {
        res.status(400).json({ status: "error", message: err });
        return;
      }
      res.status(201).json({ status: "success" });
    }
  );
});

router.delete("/:id", verifyToken, function (req, res, next) {
  connection.execute(
    "DELETE FROM customers WHERE id=?",
    [req.params.id],
    function (err, results, fields) {
      if (err) {
        res.status(400).json({ status: "error", message: err });
        return;
      }
      res.status(201).json({ status: "success" });
    }
  );
});

module.exports = router;
