require("dotenv").config();

const express = require("express");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const errorMiddleware = require("./middlewares/errorMiddleware");

const userRoutes = require("./routes/userRoute");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.json({
    message: "DevTasks API funcionando 🚀"
  });
});

module.exports = app;