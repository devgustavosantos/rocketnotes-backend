require("express-async-errors");
require("dotenv/config");
const migrationsRun = require("./database/sqlite/migrations");
const AppError = require("./utils/AppError");
const uploadConfigs = require("./configs/upload");

const cors = require("cors");
const express = require("express");
const routes = require("./routes");

migrationsRun();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/files", express.static(uploadConfigs.UPLOAD_FOLDER));

app.use(routes);

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusError).json({
      status: "Error",
      message: error.message,
    });
  }

  console.log(error);

  return response.status(500).json({
    status: "Error",
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
