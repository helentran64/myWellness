const db = require("../config/db");

/**
 * Inserts a questionnaire response into the database.
 *
 * Expects a request body containing a 'username' (string) and a 'restriction' (array).
 * Validates the input and stores the restriction array as a JSON string in the database.
 *
 * @async
 * @function insertQuestionnaireResponse
 * @param {import('express').Request} req - Express request object containing 'username' and 'restriction' in the body.
 * @param {import('express').Response} res - Express response object used to send the result.
 * @returns {Promise<void>} Sends a JSON response indicating success or failure.
 */
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
      .status(200)
      .send({ success: true, message: "Responses recorded successfully" });
  } catch (error) {
    console.error("Error inserting questionnaire responses:", error);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Error", error });
  }
};

/**
 * Retrieves a user's questionnaire responses by their username.
 *
 * @async
 * @function getQuestionnaireByUsername
 * @param {import('express').Request} req - Express request object, expects `username` in req.params.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with the questionnaire data or an error message.
 *
 * @throws {400} If the username parameter is missing.
 * @throws {404} If no questionnaire responses are found for the user.
 * @throws {500} If an internal server error occurs.
 */
const getQuestionnaireByUsername = async (req, res) => {
  const { username } = req.params;
  if (!username) {
    return res
      .status(400)
      .send({ success: false, message: "Username parameter is required." });
  }
  try {
    const query = `SELECT * FROM questionnaire WHERE username = ?`;
    const values = [username];
    const [rows] = await db.query(query, values);
    if (rows.length === 0) {
      return res
        .status(404)
        .send({ success: false, message: "No responses found for this user." });
    }
    res.status(200).send({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error fetching questionnaire responses:", error);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Error", error });
  }
};

module.exports = {
  insertQuestionnaireResponse,
  getQuestionnaireByUsername,
};
