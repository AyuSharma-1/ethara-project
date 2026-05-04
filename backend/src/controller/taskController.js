const Task = require("../models/taskModel");
const Project = require("../models/projectModel");
const User = require("../models/userModel");

const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, dueDate, priority, assignee } = req.body;
    const creator = req.user.id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.isMember(creator)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this project" });
    }

    // Only the project creator (admin) can create tasks
    if (!project.canManageProject(creator)) {
      return res
        .status(403)
        .json({ message: "Only the project admin can create tasks" });
    }

    if (assignee) {
      const assignedUser = await User.findById(assignee);
      if (!assignedUser) {
        return res.status(404).json({ message: "Assignee user not found" });
      }
      if (!project.members.map((m) => m.toString()).includes(assignee)) {
        return res
          .status(400)
          .json({ message: "Assignee must be a project member" });
      }
    }

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      assignee,
      project: projectId,
      creator,
    });

    await task.save();
    await task.populate("creator", "username email");
    await task.populate("assignee", "username email");
    await task.populate("project", "name description");

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.members.map((m) => m.toString()).includes(userId)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this project" });
    }

    const tasks = await Task.find({ project: projectId })
      .populate("creator", "username email")
      .populate("assignee", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Tasks retrieved successfully", tasks });
  } catch (error) {
    console.error("Get project tasks error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findById(id)
      .populate("creator", "username email")
      .populate("assignee", "username email")
      .populate("project", "name description members creator");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isProjectMember = task.project.members
      .map((m) => m.toString())
      .includes(userId);

    if (
      !isProjectMember &&
      task.assignee?.id !== userId &&
      task.creator.id !== userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ message: "Task retrieved successfully", task });
  } catch (error) {
    console.error("Get task by id error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, assignee, status } =
      req.body;
    const userId = req.user.id;

    const task = await Task.findById(id).populate("project", "members creator");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isProjectAdmin = task.project.canManageProject(userId);

    // Only the project admin can edit tasks
    if (!isProjectAdmin) {
      return res.status(403).json({ message: "Only the project admin can edit tasks" });
    }

    if (assignee !== undefined && assignee !== (task.assignee ? task.assignee.toString() : "")) {
      if (assignee) {
        const assignedUser = await User.findById(assignee);
        if (!assignedUser) {
          return res.status(404).json({ message: "Assignee user not found" });
        }
        if (!task.project.members.map((m) => m.toString()).includes(assignee)) {
          return res
            .status(400)
            .json({ message: "Assignee must be a project member" });
        }
        task.assignee = assignee;
      } else {
        task.assignee = null;
      }
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;
    if (status) task.status = status;

    await task.save();
    await task.populate("creator", "username email");
    await task.populate("assignee", "username email");
    await task.populate("project", "name description");

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findById(id).populate("project", "creator");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      task.creator.toString() !== userId &&
      !task.project.canManageProject(userId)
    ) {
      return res.status(403).json({ message: "You cannot delete this task" });
    }

    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const task = await Task.findById(id).populate("project", "members creator");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAssignee = task.assignee?.toString() === userId;

    if (!isAssignee) {
      return res
        .status(403)
        .json({ message: "Only the assigned user can update this task status" });
    }

    task.status = status;
    await task.save();

    res.status(200).json({ message: "Task status updated successfully", task });
  } catch (error) {
    console.error("Update task status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
