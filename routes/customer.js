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

router.get("/search", function (req, res, next) {
  console.log(req.query);
  const page = parseInt(req.query.page);
  const per_page = parseInt(req.query.per_page);
  const sort_column = req.query.sort_column;
  const sort_direction = req.query.sort_direction;
  const search = req.query.search;
  const start_idx = (page - 1) * per_page;
  var params = [];
  var sql = "SELECT * FROM customers";
  if (search) {
    sql += " WHERE name LIKE ? ";
    params.push("%" + search + "%");
  }
  if (sort_column) {
    sql += " ORDER BY " + sort_column + " " + sort_direction;
  }
  sql += " LIMIT ?, ?";
  params.push(start_idx);
  params.push(per_page);

  connection.execute(sql, params, function (err, results, fields) {
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
//localhost:3333/api/customer/search?page=1&per_page=10&sort_column=name&search=a&sort_direction=ASC

http: router.get("/searchById", verifyToken, function (req, res, next) {
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
