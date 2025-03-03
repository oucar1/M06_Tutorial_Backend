const express = require("express");
const Song = require("./models/song");
var cors = require("cors");
const jwt = require("jwt-simple");
const app = express();
const User = require("./models/users");

app.use(cors());

// Middleware that parses HTTP requests with JSON body
app.use(express.json());

const router = express.Router();
// Create a secret word that the server will use to encode and decode the token
const secret = "supersecret";

// We can create a way to add a new person to a database
// Post
router.post("/user", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({ error: "Missing username or passwword" });
  }
  const newUser = await new User({
    username: req.body.username,
    password: req.body.password,
    status: req.body.status,
  });
  try {
    await newUser.save();
    res.sendStatus(201); //created
  } catch (err) {
    res.status(400).send;
  }
});

// Authenticate a user to sign in
router.post("/auth", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(401).json({ error: "Missing username or password" });
    return;
  }
  //find the user in the database
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(401).json({ error: "User not found" });
    } else {
      //check the username and password to see if they match
      if (user.password === req.body.password) {
        //create a token
        const token = jwt.encode({ username: user.username }, secret);
        res.json({ token: token, username: user.username });
      } else {
        res.status(401).json({ error: "Invalid password" });
      }
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

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

router.delete("/songs/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    console.log(song);
    await Song.deleteOne({ _id: song._id });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).send(err);
  }
});
//use
app.use("/api", router);

app.listen(3000 || process.env.PORT, () => {
  console.log("Server is running on http://localhost:3000");
});
