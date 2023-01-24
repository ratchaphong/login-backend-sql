const express = require("express");
const { verifyToken, connection } = require("./utils");
const router = express.Router();

router.get("/", verifyToken, function (req, res, next) {
  connection.execute("SELECT * FROM orders", function (err, results, fields) {
    if (err) {
      res.status(400).json({ status: "error", message: err });
      return;
    }
    res.status(200).json({
      status: "success",
      data: results,
    });
  });
});

router.get("/query", verifyToken, function (req, res, next) {
  let condition =
    req.query?.amount && parseInt(req.query.amount) > 0
      ? `WHERE amount> ${req.query.amount} `
      : "";

  connection.execute(
    `SELECT * FROM ${req.query.table} ${condition} ORDER BY ${req.query.column} ${req.query.orderBy}`,
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
    "SELECT * FROM orders WHERE order_id=?",
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

router.get("/summaryReport", verifyToken, function (req, res, next) {
  connection.execute(
    "SELECT orders.order_id, customers.name, orders.amount, orders.date FROM customers LEFT JOIN orders ON customers.id = orders.customer_id",
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

router.post("/", verifyToken, function (req, res, next) {
  connection.execute(
    "INSERT INTO orders (date, customer_id, amount) VALUES (?, ?, ?)",
    [req.body.date, req.body.customer_id, req.body.amount],
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
    "UPDATE orders SET amount=? WHERE order_id=?",
    [req.body.amount, req.body.id],
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
    "DELETE FROM orders WHERE order_id=?",
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
