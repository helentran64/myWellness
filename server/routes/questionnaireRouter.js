const express = require("express");
const { insertQuestionnaireResponse, getQuestionnaireByUsername } = require("../controllers/questionnaireController");

const router = express.Router();

router.post("/save", insertQuestionnaireResponse);
router.get("/get_by_username/:username", getQuestionnaireByUsername);
module.exports = router;