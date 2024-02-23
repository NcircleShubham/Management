const express = require("express");
const fs = require("node:fs/promises");
const router = express.Router();
const userData = [];
async function readUserData() {
  try {
    const data = await fs.readFile("./user.json", { encoding: "utf8" });
    userData.push(...JSON.parse(data));
  } catch (err) {
    console.log(err);
  }
}
async function writeUserdata() {
  try {
    await fs.writeFile("./user.json", JSON.stringify(userData, null, 2), {
      encoding: "utf8",
    });
  } catch (err) {
    console.log(err);
  }
}

router.post("/login", async (req, res, next) => {
  try {
    await readUserData();
    const user = userData.find(
      (user) =>
        user.name === req.body.name && user.password === req.body.password
    );
    if (user) {
      res.json({ message: "Login successful", user });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    await readUserData();
    const userIndex = userData.findIndex((user) => user.name === req.body.name);
    if (userIndex !== -1) {
      res.status(400).json({ message: "User already exists" });
    } else {
      await readUserData();
      userData.push(req.body);
      await writeUserdata();
      const newUser = userData.find((user) => user.name === req.body.name);
      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
