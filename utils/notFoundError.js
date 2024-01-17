const express = require("express");
const router = express.Router();
router.route("/check/network").get((req, res) => {
  res.status(200).json({
    status: "success",
    message: "You are connected",
  });
});
router
  .route("*")
  .get((req, res) => {
    res.status(500).json({
      status: "success",
      message: "Url not found",
    });
  })
  .post((req, res) => {
    res.status(500).json({
      status: "success",
      message: "Url not found",
    });
  })
  .patch((req, res) => {
    res.status(500).json({
      status: "success",
      message: "Url not found",
    });
  })
  .put((req, res) => {
    res.status(500).json({
      status: "success",
      message: "Url not found",
    });
  })
  .delete((req, res) => {
    res.status(500).json({
      status: "success",
      message: "Url not found",
    });
  });

module.exports = router;
