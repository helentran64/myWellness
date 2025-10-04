const express = require("express");
const { insertQuestionnaireResponse } = require("../controllers/questionnaireController");

const router = express.Router();

router.post("/save", insertQuestionnaireResponse);

module.exports = router;