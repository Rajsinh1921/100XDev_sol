const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");

// User Routes
router.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.create({
    username,
    password,
  }).then((mes) => {
    if (mes) {
      res.status(200).json({
        msg: "User created successfully",
      });
    } else {
      res.status(404).json({
        msg: "User was not created",
      });
    }
  });
});

router.get("/courses", userMiddleware, (req, res) => {
  const username = req.header.username;
  const password = req.header.password;

  User.find({ username: username, password: password })
    .then(
      Course.find({}).then((list) => {
        res.status(200).json(list);
      })
    )
    .catch((err) => {
      res.status(404).json({ err: "No course found" });
    });
});

router.post("/courses/:courseId", userMiddleware, (req, res) => {
  const courseId = req.params.courseId;
  const username = req.headers.username;
  const password = req.headers.password;

  User.updateOne(
    {
      username,
      password,
    },
    {
      $push: {
        purchasedCourses: courseId,
      },
    }
  )
    .then(
      res.status(200).json({
        message: "Bought the course ",
      })
    )
    .catch((err) => {
      console.error(err);
      res.status(500).json({ msg: "Internal server error" });
    });
});

router.get("/purchasedCourses", userMiddleware, (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  User.findOne({ username, password }).then((data) => {
    Course.find({
      _id: {
        $in: data.purchasedCourses,
      },
    }).then((course) => {
      res.status(200).json({ course });
    });
  });
});

module.exports = router;
