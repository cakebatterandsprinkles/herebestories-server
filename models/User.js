import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    default: "monsterOnigiri",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("user", UserSchema);
