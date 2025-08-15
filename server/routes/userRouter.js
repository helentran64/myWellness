const express = require("express");
const { getUsers, getUserById, getUserByUsername, createUser, updateUser } = require("../controllers/userController");

const router = express.Router();
router.get("/list", getUsers);
router.get("/get/:user_id", getUserById);
router.get("/get_by_username/:username", getUserByUsername);
router.post("/create", createUser);
router.put("/update/:user_id", updateUser);

module.exports = router;
