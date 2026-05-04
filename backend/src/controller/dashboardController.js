const Task = require("../models/taskModel");
const Project = require("../models/projectModel");
const User = require("../models/userModel");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's projects
    const userProjects = await Project.find({
      $or: [{ creator: userId }, { members: userId }],
    }).select("_id");

    const projectIds = userProjects.map((p) => p._id);

    // Aggregate task statistics
    const taskStats = await Task.aggregate([
      {
        $match: {
          project: { $in: projectIds },
        },
      },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          tasksByStatus: {
            $push: "$status",
          },
          tasksByPriority: {
            $push: "$priority",
          },
          tasksByAssignee: {
            $push: "$assignee",
          },
        },
      },
    ]);

    // Process the aggregated data
    let stats = {
      totalTasks: 0,
      tasksByStatus: { "To Do": 0, "In Progress": 0, Done: 0 },
      tasksByPriority: { low: 0, medium: 0, high: 0 },
      tasksByUser: {},
    };

    if (taskStats.length > 0) {
      const data = taskStats[0];
      stats.totalTasks = data.totalTasks;

      // Count by status
      data.tasksByStatus.forEach((status) => {
        stats.tasksByStatus[status] = (stats.tasksByStatus[status] || 0) + 1;
      });

      // Count by priority
      data.tasksByPriority.forEach((priority) => {
        stats.tasksByPriority[priority] =
          (stats.tasksByPriority[priority] || 0) + 1;
      });

      // Count by assignee
      data.tasksByAssignee.forEach((assignee) => {
        if (assignee) {
          stats.tasksByUser[assignee] = (stats.tasksByUser[assignee] || 0) + 1;
        }
      });
    }

    // Get user names for assignee counts
    const userIds = Object.keys(stats.tasksByUser);
    if (userIds.length > 0) {
      const users = await User.find({ _id: { $in: userIds } }).select(
        "username email",
      );
      const userMap = {};
      users.forEach((user) => {
        userMap[user._id.toString()] = {
          username: user.username,
          email: user.email,
        };
      });

      const tasksByUserWithNames = {};
      Object.keys(stats.tasksByUser).forEach((userId) => {
        tasksByUserWithNames[userId] = {
          user: userMap[userId],
          taskCount: stats.tasksByUser[userId],
        };
      });
      stats.tasksByUser = tasksByUserWithNames;
    }

    res.status(200).json({
      message: "Dashboard statistics retrieved successfully",
      stats,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getOverdueTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's projects
    const userProjects = await Project.find({
      $or: [{ creator: userId }, { members: userId }],
    }).select("_id");

    const projectIds = userProjects.map((p) => p._id);

    // Find overdue tasks
    const overdueTasks = await Task.find({
      project: { $in: projectIds },
      dueDate: { $lt: new Date() },
      status: { $ne: "Done" },
    })
      .populate("creator", "username email")
      .populate("assignee", "username email")
      .populate("project", "name description")
      .sort({ dueDate: 1 });

    res.status(200).json({
      message: "Overdue tasks retrieved successfully",
      overdueTasks,
      count: overdueTasks.length,
    });
  } catch (error) {
    console.error("Get overdue tasks error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getDashboardStats,
  getOverdueTasks,
};
