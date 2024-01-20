const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../../03-mongo/db");
const { JWT_KEY } = require("../config");
const router = Router();
const jwt = require("jsonwebtoken");
// Admin Routes
router.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  await Admin.create({
    username,
    password,
  });
  res.status(200).json({
    msg: "Admin created successfully",
  });
});

router.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const admin = await Admin.findOne({
    username,
    password,
  });

  if (admin) {
    const newToken = jwt.sign({ username }, JWT_KEY);
    res.status(200).json({ newToken });
  } else {
    res.status(411).json({ msg: "Wrong email and password" });
  }
});

router.post("/courses", adminMiddleware, (req, res) => {
  const title = req.body.title;
  const discription = req.body.discription;
  const price = req.body.price;
  const imageLink = req.body.imageLink;

  Course.create({
    title,
    discription,
    price,
    imageLink,
  }).then((mes) => {
    if (mes) {
      res.status(200).json({
        msg: "Course created successfully",
        courseId: `new course id is ${mes._id}`,
      });
    } else {
      res.status(404).json({
        msg: "new course id",
      });
    }
  });
});

router.get("/courses", adminMiddleware, async (req, res) => {
  const response = await Course.find({});
  res.status(200).json(response);
});

module.exports = router;
