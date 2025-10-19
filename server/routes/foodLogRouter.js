const express = require("express");
const { insertFoodLog, getFoodLogs, deleteFoodLog, downloadFoodLogs } = require("../controllers/foodLogController");

const router = express.Router();

router.post("/add", insertFoodLog);
router.get("/get/:username", getFoodLogs); 
router.delete('/delete/:username/:date/:mealType/:foodName', deleteFoodLog)
router.get('/download', downloadFoodLogs);

module.exports = router;
