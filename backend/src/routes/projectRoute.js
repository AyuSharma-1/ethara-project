const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require("../controller/projectController");

const router = express.Router();

// All project routes require authentication
router.use(verifyToken);

// Project CRUD routes
router.post("/", createProject);
router.get("/", getUserProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

// Member management routes
router.post("/:id/members", addMember);
router.delete("/:id/members/:userId", removeMember);

module.exports = router;
