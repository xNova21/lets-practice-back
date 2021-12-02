const express = require("express");
let router = express.Router();
const User = require("../models/User");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signUp", async (req, res) => {
  let comprobation;
  let name = req.body.username;
  let languageSpoken = req.body.languageSpoken;

  try {
    if (!name) {
      return res.json({ message: "Insert an username" });
    } else {
      comprobation = await User.findOne({ username: name });
    }
  } catch (error) {
    res.json({ message: `Can´t connect with database.` });
    return;
  }
  if (comprobation == null) {
    if (!req.body.password) {
      res.json({ message: "Please, insert a password." });
    } else if (!name) {
      res.json({ message: "Please, insert a name." });
    } else {
      await User.create({
        username: name,
        password: bcrypt.hashSync(
          req.body.password,
          parseFloat(process.env.SALT)
        ),
        valoration: {value: 0, valoratedBy: []},
        languageSpoken: languageSpoken
      }),
        res.json({ auth: true, message: "User created" });
    }
  } else {
    res.json({ auth: false, message: "This user is already in use" });
    return;
  }
});
router.post("/logIn", async (req, res) => {
  let name = req.body.username;
  let pass = req.body.password;
  let findUser;
  try {
    if (!name) {
      return res.json({ message: "Insert an user" });
    } else {
      findUser = await User.findOne({ username: name });
    }
  } catch (error) {
    console.log(error, "este es el error");
    res.json({ auth: false, message: `Can´t connect with database.` });
    return;
  }
  if (findUser == null) {
    res.json({ message: "This user doesn´t exist." });
    return;
  } else {
    let comparacion = await bcrypt.compare(pass, findUser.password);
    if (comparacion == true) {
      let token = jwt.sign({ id: findUser._id }, process.env.SECRET_WORD, {
        expiresIn: 3000,
      });
      res.json({
        id: findUser._id,
        token,
        auth: true,
        message: `Wellcome ${req.body.username}`,
      });
    } else {
      res.json({ token: null, auth: false, message: "Incorrect password" });
    }
  }
});

module.exports = router;
