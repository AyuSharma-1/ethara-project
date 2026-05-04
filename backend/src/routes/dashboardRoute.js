const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  getOverdueTasks,
} = require("../controller/dashboardController");

const router = express.Router();

router.use(verifyToken);

router.get("/stats", getDashboardStats);
router.get("/overdue", getOverdueTasks);

module.exports = router;
