// import express and mongoose
import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";
import mongoose from "mongoose";
import AuthRoute from "./routes/api/auth.js";
import PostsRoute from "./routes/api/posts.js";
import PromptsRoute from "./routes/api/prompts.js";
import UsersRoute from "./routes/api/users.js";

dotenv.config();

const app = express();

// Define PORT
const PORT = process.env.PORT || 5000;

// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASS = process.env.MONGODB_PASS;

// connect db
mongoose.connect(
  MONGODB_URI,
  {
    auth: {
      username: MONGODB_USERNAME,
      password: MONGODB_PASS,
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  function (error) {
    if (error) console.error("Mongoose error", error);
  }
);

// Init Middleware
// Body parser
app.use(
  json({
    extended: false,
  })
);

app.use(cors());

// Define Routes
app.use("/api/posts", PostsRoute);
app.use("/api/users", UsersRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/prompts", PromptsRoute);

// start server
app.listen(PORT, () => console.log(`Backend server started on port: ${PORT}`));
