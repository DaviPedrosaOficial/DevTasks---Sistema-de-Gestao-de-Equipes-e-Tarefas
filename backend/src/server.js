require("dotenv").config();

const express = require("express");
const cors = require("cors");


const userRoutes = require("./routes/userRoute");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "DevTasks API funcionando 🚀"
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});