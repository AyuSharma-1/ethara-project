const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require("../controller/taskController");

const router = express.Router();

router.use(verifyToken);

router.post("/projects/:projectId/tasks", createTask);
router.get("/projects/:projectId/tasks", getProjectTasks);
router.get("/tasks/:id", getTaskById);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);
router.put("/tasks/:id/status", updateTaskStatus);

module.exports = router;
