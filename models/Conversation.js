const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conversationSchema = new Schema(
  {
    status:{type: Boolean},
    users: [{ type: String }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  {
    timestamps: true,
  }
);
const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
