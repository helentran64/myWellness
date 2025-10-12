const db = require("../config/db");

const insertFoodLog = async (req, res) => {
  const { username, food, mealType } = req.body;
  const date = new Date().toISOString().split("T")[0];
  if (!username || !food || !mealType || !date) {
    return res.status(400).send({
      success: false,
      message:
        "Invalid request body. 'username', 'food', 'mealType' are required.",
    });
  }
  try {
    const query = `INSERT INTO food_log (username, food, mealType, date) VALUES (?, ?, ?, ?)`;
    const values = [username, food, mealType, date];
    await db.query(query, values);
    res
      .status(200)
      .send({ success: true, message: "Food log recorded successfully" });
  } catch (error) {
    console.error("Error inserting food log:", error);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Error", error });
  }
};

const getFoodLogs = async (req, res) => {
  const username = req.params.username;
  try {
    const query = `SELECT * FROM food_log WHERE username = ? ORDER BY date DESC`;
    const [rows] = await db.query(query, [username]);

    // Parse JSON stored in 'food' column
    const logs = rows.map(row => ({
      username: row.username,
      mealType: row.mealType,
      date: row.date,
      food: JSON.parse(row.food),
    }));

    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching food logs:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

const deleteFoodLog = async (req, res) => {
  const { username, date, mealType, foodName } = req.params

  if (!username || !date || !mealType || !foodName) {
    return res.status(400).json({
      success: false,
      message: 'Missing required parameters',
    })
  }

  try {
    // Assuming `food` column stores JSON, use JSON_EXTRACT to match name
    const query = `
      DELETE FROM food_log 
      WHERE username = ? 
        AND date = ? 
        AND mealType = ? 
        AND JSON_EXTRACT(food, '$.name') = ?
    `
    const values = [username, date, mealType, foodName]

    await db.query(query, values)

    res.status(200).json({
      success: true,
      message: `${foodName} removed from ${mealType} on ${date}`,
    })
  } catch (err) {
    console.error('Error deleting food log:', err)
    res.status(500).json({ success: false, message: 'Internal server error', error: err })
  }
}


module.exports = { insertFoodLog, getFoodLogs, deleteFoodLog };