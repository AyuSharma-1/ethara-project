const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Add creator to members array when project is created
projectSchema.pre("save", function () {
  if (this.isNew) {
    const creatorId = this.creator.toString();
    const isAlreadyMember = this.members.some(member => member.toString() === creatorId);
    if (!isAlreadyMember) {
      this.members.push(this.creator);
    }
  }
});

// Instance methods
projectSchema.methods.isAdmin = function (userId) {
  const creatorId = this.creator._id ? this.creator._id.toString() : this.creator.toString();
  return creatorId === userId.toString();
};

projectSchema.methods.isMember = function (userId) {
  return this.members.some((member) => {
    const memberId = member._id ? member._id.toString() : member.toString();
    return memberId === userId.toString();
  });
};

projectSchema.methods.canManageProject = function (userId) {
  return this.isAdmin(userId);
};

projectSchema.methods.canViewProject = function (userId) {
  return this.isMember(userId);
};

module.exports = mongoose.model("Project", projectSchema);
