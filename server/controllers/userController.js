const db = require("../config/db");

/**
 * Retrieves all users from the database and sends them in the response.
 *
 * @async
 * @function getUsers
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with user data or error message.
 */
const getUsers = async (req, res) => {
  try {
    const data = await db.query("SELECT * FROM users");
    if (!data) {
      return res
        .status(404)
        .send({ success: false, message: "No users found" });
    }
    res
      .status(200)
      .send({ success: true, message: "All student records", data: data[0] });
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Error", error });
  }
};

/**
 * Retrieves a user by their ID from the database.
 *
 * @async
 * @function getUserById
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.user_id - The ID of the user to retrieve.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with user data if found, or an error message if not.
 */
const getUserById = async (req, res) => {
  const userId = req.params.user_id;
  try {
    const data = await db.query("SELECT * FROM users WHERE user_id = ?", [
      userId,
    ]);
    if (data[0].length === 0) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .send({ success: true, message: "User found", data: data[0] });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Error", error });
  }
};

/**
 * Creates a new user in the database.
 *
 * @async
 * @function createUser
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing user details
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const createUser = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    const { firstName, lastName, email, username, password } = req.body;
    if (!firstName || !lastName || !email || !username || !password) {
      return res
        .status(400)
        .send({ success: false, message: "All fields are required" });
    }
    const data = await db.query(
      "INSERT INTO users (firstName, lastName, email, username, password) VALUES (?, ?, ?, ?, ?)",
      [firstName, lastName, email, username, password]
    );
    if (!data || data[0].affectedRows === 0) {
      return res
        .status(500)
        .send({ success: false, message: "Failed to create user" });
    }
    res.status(201).send({
      success: true,
      message: "User created successfully",
      data: {
        userId: data[0].user_id,
        firstName,
        lastName,
        email,
        username,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Error", error });
  }
};

/**
 * Updates a user's information in the database.
 *
 * @async
 * @function updateUser
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.user_id - ID of the user to update.
 * @param {Object} req.body - Request body containing user fields.
 * @param {string} req.body.firstName - Updated first name.
 * @param {string} req.body.lastName - Updated last name.
 * @param {string} req.body.email - Updated email address.
 * @param {string} req.body.username - Updated username.
 * @param {string} req.body.password - Updated password.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with the update result.
 */
const updateUser = async (req, res) => {
  const user_id = req.params.user_id;
  const { firstName, lastName, email, username, password } = req.body;

  if (!firstName || !lastName || !email || !username || !password) {
    return res
      .status(400)
      .send({ success: false, message: "All fields are required" });
  }

  try {
    const data = await db.query(
      "UPDATE users SET firstName = ?, lastName = ?, email = ?, username = ?, password = ? WHERE user_id = ?",
      [firstName, lastName, email, username, password, user_id]
    );

    if (data[0].affectedRows === 0) {
      return res
        .status(404)
        .send({ success: false, message: "User not found or no changes made" });
    }

    res.status(200).send({
      success: true,
      message: "User updated successfully",
      data: {
        user_id,
        firstName,
        lastName,
        email,
        username,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Error", error });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser };
