const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, unique: true, default: () => new mongoose.Types.ObjectId().toString() }, 
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
