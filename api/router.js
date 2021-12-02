const express = require("express");
let router = express.Router();
const User = require("../models/User");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

// get names of all users talked with

router.get("/home", async (req, res) => {
  let idUser = req.id;
  let conversations;
  let users = [];
  let usernames = [];
  try {
    conversations = await User.findById(idUser)
      .populate("conversations")
      .select("conversations");
    conversations = conversations.conversations;
    conversations.forEach((userList) => {
      userList.users.forEach((otherUser) => {
        if (otherUser != idUser) {
          users.push(otherUser);
        }
      });
    });
    let x;
    for (i = 0; i < users.length; i++) {
      x = await User.findById(users[i]).select("username");
      usernames.push(x);
    }

    res.json(usernames);
  } catch (error) {
    res.json({ message: `Can´t connect with database.` });
    return;
  }
});

// get message Thread with one user
router.get("/user/:idUser2", async (req, res) => {
  let idUser = req.id;
  let idUser2 = req.params.idUser2;
  try {
    let conversations = await User.findById(idUser).select("conversations");
    conversations = conversations.conversations;
    conversations.forEach(async (convId) => {
      let x = await Conversation.findById(convId)
        .populate("messages")
        .sort({ messsages: -1 });
      if (x.users.includes(idUser2)) {
        res.json({ messages: x.messages, id: x._id });
      }
    });
  } catch (error) {
    return res.json({ message: `Can´t connect with database.` });
  }
});

// post form for search
router.post("/user/form", async (req, res) => {
  let { languageSpoken, practice, country } = req.body;
  try {
    if (languageSpoken !== "" && !practice && !country) {
      let users = await User.find(
        { languageSpoken: languageSpoken },
        { password: 0 }
      ).sort({ updatedAt: -1 });
      res.json(users);
    } else if (!languageSpoken && !practice && country !== "") {
      let users = await User.find({ country: country }, { password: 0 }).sort({
        updatedAt: -1,
      });
      res.json(users);
    } else if (!languageSpoken && practice != "" && !country) {
      let users = await User.find(
        {
          $or: [
            { [`practice.${practice}`]: "begginer" },
            { [`practice.${practice}`]: "low" },
            { [`practice.${practice}`]: "intermediate" },
            { [`practice.${practice}`]: "hight" },
            { [`practice.${practice}`]: "native" },
          ],
        },
        { password: 0 }
      ).sort({ updatedAt: -1 });
      res.json(users);
    } else if (!languageSpoken && practice != "" && country != "") {
      let users = await User.find(
        {
          $and: [
            {
              $or: [
                { [`practice.${practice}`]: "begginer" },
                { [`practice.${practice}`]: "low" },
                { [`practice.${practice}`]: "intermediate" },
                { [`practice.${practice}`]: "hight" },
                { [`practice.${practice}`]: "native" },
              ],
            },
            { country: country },
          ],
        },
        { password: 0 }
      ).sort({ updatedAt: -1 });
      res.json(users);
    } else if (languageSpoken != "" && !practice && country != "") {
      let users = await User.find(
        {
          $and: [{ languageSpoken: languageSpoken }, { country: country }],
        },
        { password: 0 }
      ).sort({ updatedAt: -1 });
      res.json(users);
    } else if (languageSpoken != "" && practice != "" && !country) {
      let users = await User.find(
        {
          $and: [
            {
              $or: [
                { [`practice.${practice}`]: "begginer" },
                { [`practice.${practice}`]: "low" },
                { [`practice.${practice}`]: "intermediate" },
                { [`practice.${practice}`]: "hight" },
                { [`practice.${practice}`]: "native" },
              ],
            },
            { languageSpoken: languageSpoken },
          ],
        },
        { password: 0 }
      ).sort({ updatedAt: -1 });
      res.json(users);
    } else if (!languageSpoken && !practice && !country) {
      let users = await User.find({}, { password: 0 }).sort({ updatedAt: -1 });
      res.json(users);
    } else if (languageSpoken != "" && practice != "" && country != "") {
      let users = await User.find(
        {
          $and: [
            {
              $or: [
                { [`practice.${practice}`]: "begginer" },
                { [`practice.${practice}`]: "low" },
                { [`practice.${practice}`]: "intermediate" },
                { [`practice.${practice}`]: "hight" },
                { [`practice.${practice}`]: "native" },
              ],
            },
            { languageSpoken: languageSpoken },
            { country: country },
          ],
        },
        { password: 0 }
      ).sort({ updatedAt: -1 });
      res.json(users);
    }
  } catch (error) {
    return res.json({ message: `An error has occurred:${error}` });
  }
});
//  other user profile route
router.get("/profile/:idUser2", async (req, res) => {
  let idUser2 = req.params.idUser2;
  try {
    let profile = await User.findById(idUser2, {
      password: 0,
      conversations: 0,
    });
    res.json(profile);
  } catch (error) {
    return res.json({ message: `An error has occurred:${error}` });
  }
});
// new message route
router.post("/newMessage/:idUser2", async (req, res) => {
  let idUser2 = req.params.idUser2;
  let idUser = req.id;
  let message = req.body.text;
  try {
    let newMessage = await Message.create({
      sentBy: idUser,
      sentTo: idUser2,
      body: message,
    });
    let searchConversation = await Conversation.findOne({
      $and: [{ users: idUser }, { users: idUser2 }],
    });
    if (!searchConversation) {
      let newConversation = await Conversation.create({
        status: true,
        users: [idUser, idUser2],
        messages: [newMessage._id],
      });
      await User.findByIdAndUpdate(
        { _id: idUser },
        { $push: { conversations: newConversation } }
      );
      await User.findByIdAndUpdate(
        { _id: idUser2 },
        { $push: { conversations: newConversation } }
      );
    } else if (searchConversation.status == false) {
      await Message.findByIdAndDelete(newMessage._id);
      return res.json({ message: "You can´t send a message to this user." });
    } else {
      await Conversation.findByIdAndUpdate(
        { _id: searchConversation._id },
        { $push: { messages: newMessage } }
      );
    }
    res.json({ message: `Message sent.` });
  } catch (error) {
    res.json({ message: `An error has occurred:${error}` });
  }
});

// Delete conversation route
router.delete("/delete/:idConversation", async (req, res) => {
  let idUser = req.id;
  let idUser2;
  let idConversation = req.params.idConversation;
  try {
    let conversation = await Conversation.findById(idConversation);
    conversation.users.forEach((ids) => {
      if (ids != idUser) {
        idUser2 = ids;
      }
    });
    await User.findByIdAndUpdate(idUser, {
      $pull: { conversations: idConversation },
    });
    await Conversation.findByIdAndUpdate(idConversation, { status: false });
    let x = await User.findOne({
      $and: [{ _id: idUser2 }, { conversations: idConversation }],
    });
    if (x == null) {
      conversation.messages.forEach(async (idMess) => {
        await Message.findByIdAndDelete(idMess);
      });
      await Conversation.findByIdAndUpdate(idConversation, { messages: [] });
      res.json({ message: "Deleted." });
    } else {
      return res.json({ message: "Conversation deleted." });
    }
  } catch (error) {
    res.json({ message: `An error has occurred:${error}` });
  }
});
// Show self profile route
router.get("/home/profile", async (req, res) => {
  let idUser = req.id;
  try {
    let selfProfile = await User.findById(idUser, {
      password: 0,
      conversations: 0,
    });
    res.json(selfProfile);
  } catch (error) {
    res.json({ message: `An error has occurred:${error}` });
  }
});
// Update self profile route
router.post("/updateProfile", async (req, res) => {
  let idUser = req.id;
  let { country, practice, profileText, profileImage } = req.body;
  try {
    await User.findByIdAndUpdate(idUser, {
      country: country,
      practice: practice,
      profileText: profileText,
      profileImage: profileImage,
    });
    res.json({ message: "Updated" });
  } catch (error) {
    res.json({ message: `An error has occurred: ${error}` });
  }
});

//Change password
router.post("/home/profile/changePassword", async (req, res) => {
  let idUser = req.id;
  let password = req.body.password;
  let newPassword = req.body.newPassword;
  let findUser = await User.findById(idUser);
  let comparacion = await bcrypt.compare(password, findUser.password);
  if (comparacion == true) {
    await User.findByIdAndUpdate(idUser, {
      password: bcrypt.hashSync(newPassword, parseFloat(process.env.SALT)),
    });
    return res.json({ message: "Password successfuly changed." });
  } else {
    return res.json({ message: "Actual password wrong." });
  }
});
// Delete self profile route
router.delete("/deleteProfile", async (req, res) => {
  let idUser = req.id;
  try {
    await User.findByIdAndUpdate(idUser, {
      _id: idUser,
      username: "This user was deleted.",
    });
  } catch (error) {
    res.json({ message: `An error has occurred: ${error}` });
  }
});
// Valoration route
router.post("/valoration/:idUser2", async (req, res) => {
  let idUser = req.id;
  let idUser2 = req.params.idUser2;
  let valoration = req.body.valoration;
  let alreadyValorate = false;
  try {
    let comprobation = await User.findById(idUser2).select("valoration");
    comprobation.valoration.valoratedBy.forEach((idValorated) => {
      if (idUser == idValorated) {
        alreadyValorate = true;
        return res.json({ message: "User already valorated." });
      }
    });
    if (alreadyValorate == false) {
      let userValoration = await User.findById(idUser2).select("valoration");
      let arrayValorations = userValoration.valoration.valoratedBy;
      let actualValue =
        userValoration.valoration.value + parseFloat(valoration);
      arrayValorations.push(idUser);
      await User.findByIdAndUpdate(idUser2, {
        valoration: { value: actualValue, valoratedBy: arrayValorations },
      });
      res.json({ message: "Success valoration." });
    }
  } catch (error) {
    res.json({ message: `An error has occurred: ${error}` });
  }
});
//Verify auth
router.get("/validateUser", async (req, res) => {
  return res.json({ auth: true });
});

module.exports = router;
