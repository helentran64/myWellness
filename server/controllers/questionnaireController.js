const db = require("../config/db");

// Insert a new questionnaire response into the database
const insertQuestionnaireResponse = async (req, res) => {
  const { username, restriction } = req.body;

  if (!username || !restriction || !Array.isArray(restriction)) {
    return res.status(400).send({
      success: false,
      message:
        "Invalid request body. 'username' and 'restriction' are required.",
    });
  }

  try {
    const query = `INSERT INTO questionnaire (username, restriction) VALUES (?, ?)`;
    const values = [username, JSON.stringify(restriction)];

    await db.query(query, values);

    res
      .status(201)
      .send({ success: true, message: "Responses recorded successfully" });
  } catch (error) {
    console.error("Error inserting questionnaire responses:", error);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Error", error });
  }
};

module.exports = {
  insertQuestionnaireResponse,
};
