const express = require("express");
const multer = require("multer");
const {
  createUser,
  getUsers,
  searchUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
} = require("../api/userApi");
const { protect } = require("../middleware/userApiMiddleware");
const path = require("path");

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
router.post("/", protect, upload.single("image"),createUser);
router.post("/login", loginUser);
router.get("/", protect, getUsers);
router.get("/search", protect, searchUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, upload.single("image"), updateUser);
router.delete("/:id",  protect, deleteUser);

module.exports = router;
