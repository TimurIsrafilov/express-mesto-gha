const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const { PORT = 3000 } = process.env;
const app = express();

const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  req.user = {
    _id: "64036d4a3e72ba5c0be45df2",
  };

  next();
});
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
