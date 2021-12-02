const { text } = require("express");
const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    conversations: [{ type: Schema.Types.ObjectId, ref: "Conversation" }],
    valoration: {value: { type: Number }, valoratedBy: [{type: String}]},
    country: {type: String},
    languageSpoken: {type: String, required: true },
    practice: {},
    profileText: {type: String},
    profileImage: {type: String}
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
