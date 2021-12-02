const mongoose = require("mongoose")
const Schema = mongoose.Schema
const messageSchema = new Schema(
    {
        sentBy: {type: String}, 
        sentTo: {type: String},
        body: {type: String}
    },
    {
      timestamps: true
    }
)
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;