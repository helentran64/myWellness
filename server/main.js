const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mysqlPool = require("./config/db");
const cors = require('cors');

dotenv.config({ path: "./.env" });
app.use(express.json());
app.use(cors());

// routes
app.use('/api/users', require('./routes/userRouter'));
app.use('/api/questionnaire', require('./routes/questionnaireRouter'));

app.get("/test", (req, res) => {
  res.send("Hello World from Express.js!");
});

const PORT = process.env.PORT || 3000;

mysqlPool.query("SELECT 1").then(() => {
  console.log("Database connection successful");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
