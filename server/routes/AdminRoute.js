const router = require("express").Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middleware/authMiddleware");

router.post("/sign", async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      email: email,
      name: name,
      password: hash,
    });

    await newUser.save();
    console.log(name);
    res.json({ msg: "User Created" });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.json({ error: "User Doesn't Exist" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({ error: "Wrong Username And Password Combination" });
    }

    const accessToken = sign(
      { email: user.email, id: user.id, name: user.name },
      "shhhhh its a secret"
    );

    res.json({
      token: accessToken,
      name: user.name,
      id: user.id,
      gmail: user.email,
    });
  } catch (err) {
    next(err);
  }
});

// to check if the user is already logged in
router.get("/logcheck", validateToken, (req, res) => {
  res.json(req.user);
});


// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = router;