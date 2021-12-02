let express = require("express");
let app = express();
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose")
const router = require("./api/router")
const auth = require("./api/auth")
let verifyToken = require("./middleware/authToken");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ly1xx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(function () {
    console.log("We´re connected");
  })
  .catch((error) => {
    console.log(`An error has occurred:${error}`);
  });

app.use(cors());
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/router", verifyToken, router);
app.use("/api/auth", auth)
app.listen(process.env.PORT, () => {
  console.log(`Awaiting`);
});
