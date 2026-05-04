const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnect");
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const projectRoutes = require("./routes/projectRoute");
const taskRoutes = require("./routes/taskRoute");
const dashboardRoutes = require("./routes/dashboardRoute");

connectDB();

const app = express();
const PORT = process.env.PORT || 7001;

app.use(cors());
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

const path = require("path");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../..", "frontend", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../..", "frontend", "dist", "index.html")
    );
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
