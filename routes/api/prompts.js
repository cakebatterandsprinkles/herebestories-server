import { Router } from "express";
import fetch from "node-fetch";
import Unsplash from "unsplash-js";
import ages from "../../data/ages.js";
import characters from "../../data/characters.js";
import dilemmas from "../../data/dilemmas.js";
import features from "../../data/features.js";

global.fetch = fetch;

const router = Router();

// @route  GET api/auth
// @desc   Test Route
// @access public
router.get("/text", async (req, res) => {
  try {
    const prompt = {
      character: characters[Math.floor(Math.random() * characters.length)],
      age: ages[Math.floor(Math.random() * ages.length)],
      feature: features[Math.floor(Math.random() * features.length)],
      dilemma: dilemmas[Math.floor(Math.random() * dilemmas.length)],
    };
    res.json(prompt);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
// @route  GET api/auth
// @desc   Test Route
// @access public
router.get("/images", async (req, res) => {
  try {
    const unsplash = Unsplash.createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
    });

    unsplash.photos
      .getRandom({
        count: 6,
        orientation: "portrait",
      })
      .then((json) => {
        res.json(json.response.map((photo) => photo.urls.small));
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
