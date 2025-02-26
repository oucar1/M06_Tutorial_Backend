const express = require("express");
const Song = require("./models/song");
var cors = require("cors");

const app = express();
app.use(cors());

// Middleware that parses HTTP requests with JSON body
app.use(express.json());

const router = express.Router();

// Get list of all songs in the database
router.get("/songs", async (req, res) => {
  try {
    const songs = await Song.find({});
    res.send(songs);
    console.log(songs);
  } catch (err) {
    console.log(err);
  }
});

// Get a specific song by ID
router.get("/songs/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).send({ error: "Song not found" });
    }
    res.json(song);
    console.log(song);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error" });
  }
});

// Add a new song to the database
router.post("/songs", async (req, res) => {
  try {
    const song = await new Song(req.body);
    await song.save();
    res.status(201).json(song);
    console.log(song);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Update or put a single song... we use a put request and grab the song by id.. kind of combining adding and viewing a single song
router.put("/songs/:id", async (req, res) => {
  try {
    // Grab data from front end
    const song = req.body;

    // Update one function finds and updates an item based on id
    await Song.updateOne({ _id: req.params.id }, song);
    console.log(song);

    res.sendStatus(204);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.use("/api", router);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
