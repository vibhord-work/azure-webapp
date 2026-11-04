require("dotenv").config();

const express = require("express");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");

const patientsRouter = require("./routes/patients");

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "100kb" }));
app.use(morgan("combined"));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "azure-webapp"
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Azure Web App API is running"
  });
});

app.use("/api/patients", patientsRouter);

app.use(express.static(path.join(__dirname, "../public")));

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
