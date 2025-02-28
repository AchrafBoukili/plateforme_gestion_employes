const User = require("../models/user");
const generateToken = require("../config/jwt");
const jwt = require("jsonwebtoken");

exports.createSuperAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });

    if (!existingAdmin) {
      const adminUser = new User({
        name: "Super Admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        city: "Meknes",
        role: "admin",
      });

      await adminUser.save();
      console.log("Super Admin created successfully!");
    } else {
      console.log("ℹ️Admin user already exists.");
    }
  } catch (err) {
    console.error("Error creating Super Admin:", err);
  }
};
exports.createUser = async (req, res) => {
  console.log("🔹 Request Headers:", req.headers);
  console.log("🔹 Content-Type:", req.headers["content-type"]);
  console.log("🔹 Raw Request Body:", req.body);
  console.log("🔹 Uploaded File:", req.file); // ✅ Debug uploaded file

  try {
    const { name, city, email, password, role } = req.body;

    if (!name || !email || !password || !city) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newUser = new User({
      name,
      email,
      password,
      city,
      role: role || "employe",
      image: req.file ? req.file.filename : "", // ✅ Save only filename
    });

    console.log("🆕 New User:", newUser);
    await newUser.save();
    console.log("✅ User Saved Successfully!");

    return res.status(201).json({ message: "User created successfully", user: newUser });

  } catch (err) {
    console.error("⛔ Error Creating User:", err);
    return res.status(500).json({ error: "Error creating user" });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = generateToken({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      city: user.city,
      image: user.image ? user.image : "",
    });

    
    res.status(201).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        image: user.image ? user.image : "",
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving users" });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ error: "Keyword is required" });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { city: { $regex: keyword, $options: "i" } },
      ],
    }).select("-password");

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error searching users" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, city, email, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    user.name = name || user.name;
    user.city = city || user.city;
    user.email = email || user.email;
    user.role = role || user.role;

    if (req.file) {
      user.image = req.file.filename;
    }
    const updatedUser ={
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      city: user.city,
      image: user.image ? user.image : "",
    }

    await user.save();
    const token = generateToken(updatedUser);
  res.status(201).json({
    message: "✅ User updated successfully! ",
    user:user,
    token:token
  });  
} catch (err) {
    res.status(400).json({ error: "Error updating user" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

 exports.checkAdmin =  (data)=> {
  const token = data

  const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
  console.log("decodder",decoded)
  if (decoded.user.role !== "admin") return false
  return true
 }