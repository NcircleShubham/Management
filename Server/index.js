const express = require("express");

const app = express();

app.use(express.json());

const useController = require("./controllers/userController");
app.use("/user", useController);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
