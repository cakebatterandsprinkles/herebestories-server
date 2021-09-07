import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  promptText: {
    type: String,
  },
  promptImages: {
    type: [String],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("post", PostSchema);
