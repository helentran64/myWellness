const db = require("../config/db");
const ExcelJS = require('exceljs');

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

const downloadFoodLogs = async (req, res) => {
  try {
    const username = req.query.username || req.user?.username || '';
    console.log('Download requested for username:', username);
    
    // Get all food logs for the user
    const [rows] = await db.query(
      'SELECT date, mealType, food FROM food_log WHERE username = ? ORDER BY date DESC',
      [username]
    );

    console.log('Rows returned from database:', rows.length);
    console.log('First few rows:', rows.slice(0, 2));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Food Logs');

    // Define columns to match frontend headers (excluding username)
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 12 },
      { header: 'Meal Type', key: 'mealType', width: 15 },
      { header: 'Food', key: 'foodName', width: 30 },
      { header: 'Calories', key: 'calories', width: 10 },
      { header: 'Protein (g)', key: 'protein', width: 12 },
      { header: 'Carbs (g)', key: 'carbs', width: 12 },
      { header: 'Fat (g)', key: 'fat', width: 10 },
      { header: 'Sodium', key: 'sodium', width: 10 },
      { header: 'Sugar', key: 'sugar', width: 10 },
      { header: 'Serving Weight (g)', key: 'servingWeight', width: 18 },
      { header: 'Serving Unit', key: 'servingUnit', width: 15 },
      { header: 'Serving Quantity', key: 'servingQuant', width: 18 },
    ];

    // Add data rows by parsing food JSON
    rows.forEach((row, index) => {
      let food = {};
      try {
        food = JSON.parse(row.food);
        console.log(`Row ${index} parsed successfully:`, food);
      } catch (e) {
        console.error(`Error parsing food JSON for row ${index}:`, e.message);
        console.error('Raw food data:', row.food);
      }
      
      worksheet.addRow({
        date: row.date,
        mealType: row.mealType,
        foodName: food.name || '',
        calories: food.calories ?? '',
        protein: food.protein ?? '',
        carbs: food.carbs ?? '',
        fat: food.fat ?? '',
        sodium: food.sodium ?? '',
        sugar: food.sugar ?? '',
        servingWeight: food.servingWeight ?? '',
        servingUnit: food.servingUnit ?? '',
        servingQuant: food.servingQuant ?? '',
      });
    });

    console.log('Total rows added to worksheet:', worksheet.rowCount - 1); // -1 for header

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=food_log.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Excel download error:', error);
    res.status(500).send('Error generating Excel file');
  }
};


module.exports = { insertFoodLog, getFoodLogs, deleteFoodLog, downloadFoodLogs };