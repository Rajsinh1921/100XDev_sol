const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config");
const { User, Course } = require("../../03-mongo/db");

// User Routes
router.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const newUser = await User.create({
    username,
    password,
  });

  if (newUser) {
    res.status(201).json({ msg: `Your id is ${newUser._id}` });
  }
});

router.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({
    username,
    password,
  });
  if (user) {
    const newToken = jwt.sign({ username }, JWT_KEY);
    res.status(200).json(newToken);
  } else {
    res.status(404).json({ msg: "Wrong Email or Password" });
  }
});

router.get("/courses", async (req, res) => {
  try {
    const username = req.headers.username;
    const password = req.headers.password;

    const user = await User.findOne({ username, password });

    if (user) {
      const courses = await Course.find({});
      res.status(200).json(courses);
    } else {
      res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/courses/:courseId", userMiddleware, (req, res) => {});

router.get("/purchasedCourses", userMiddleware, (req, res) => {
  // Implement fetching purchased courses logic
});

module.exports = router;
