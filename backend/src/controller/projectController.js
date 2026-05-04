const Project = require("../models/projectModel");
const User = require("../models/userModel");

// Create a new project
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const creator = req.user.id;

    const newProject = new Project({
      name,
      description,
      creator,
    });

    await newProject.save();

    // Populate creator and members for response
    await newProject.populate("creator", "username email");
    await newProject.populate("members", "username email");

    res.status(201).json({
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Create project error:", error.stack || error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all projects for the logged-in user
const getUserProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.find({
      $or: [{ creator: userId }, { members: userId }],
    })
      .populate("creator", "username email")
      .populate("members", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Projects retrieved successfully",
      projects,
    });
  } catch (error) {
    console.error("Get user projects error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(id)
      .populate("creator", "username email")
      .populate("members", "username email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.canViewProject(userId)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this project" });
    }

    res
      .status(200)
      .json({ message: "Project retrieved successfully", project });
  } catch (error) {
    console.error("Get project by id error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a project (only creator can update)
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is the creator
    if (!project.canManageProject(userId)) {
      return res
        .status(403)
        .json({ message: "Only project creator can update the project" });
    }

    project.name = name || project.name;
    project.description = description || project.description;

    await project.save();

    await project.populate("creator", "username email");
    await project.populate("members", "username email");

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a project (only creator can delete)
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is the creator
    if (!project.canManageProject(userId)) {
      return res
        .status(403)
        .json({ message: "Only project creator can delete the project" });
    }

    await Project.findByIdAndDelete(id);

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a member to project (only creator can add members)
const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const currentUserId = req.user.id;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if current user is the creator
    if (!project.canManageProject(currentUserId)) {
      return res
        .status(403)
        .json({ message: "Only project creator can add members" });
    }

    // Check if user to add exists
    const userToAdd = await User.findById(userId);
    if (!userToAdd) {
      return res.status(404).json({ message: "User to add not found" });
    }

    // Check if user is already a member
    if (project.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User is already a member of this project" });
    }

    project.members.push(userId);
    await project.save();

    await project.populate("creator", "username email");
    await project.populate("members", "username email");

    res.status(200).json({
      message: "Member added successfully",
      project,
    });
  } catch (error) {
    console.error("Add member error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove a member from project (only creator can remove members)
const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const currentUserId = req.user.id;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if current user is the creator
    if (!project.canManageProject(currentUserId)) {
      return res
        .status(403)
        .json({ message: "Only project creator can remove members" });
    }

    // Cannot remove the creator
    if (userId === currentUserId) {
      return res
        .status(400)
        .json({ message: "Cannot remove project creator from members" });
    }

    // Check if user is a member
    if (!project.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User is not a member of this project" });
    }

    project.members = project.members.filter(
      (memberId) => memberId.toString() !== userId,
    );

    await project.save();

    await project.populate("creator", "username email");
    await project.populate("members", "username email");

    res.status(200).json({
      message: "Member removed successfully",
      project,
    });
  } catch (error) {
    console.error("Remove member error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
