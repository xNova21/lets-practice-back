require("dotenv").config();
const mongoose = require(`mongoose`);
const User = require("./models/User");
const Message = require("./models/Message");
const bcrypt = require("bcrypt");
const Conversation = require("./models/Conversation");
let hash = bcrypt.hashSync("1234", parseFloat(process.env.SALT));
let hash2 = bcrypt.hashSync("12345", parseFloat(process.env.SALT));
let hash3 = bcrypt.hashSync("123456", parseFloat(process.env.SALT));
let hash4 = bcrypt.hashSync("123457", parseFloat(process.env.SALT));

let usersArray = [
  {
    _id: "618255b489701d9c52cb635b",
    username: "Aya",
    password: hash,
    conversations: ["61840a44ed38abe28e6ef4d3"],
    valoration: { value: 5, valoratedBy: ["618150dd73375b05dff695a8"] },
    country: "Japan",
    languageSpoken: "japanese",
    practice: { english: "low" },
    profileText: "こんにちは、あやです。",
    profileImage: "motorbike",
  },
  {
    _id: "618150dd73375b05dff695a8",
    username: "Paul",
    password: hash2,
    conversations: ["61840a44ed38abe28e6ef4d3", "61840a44ed38abe28e6ef4d4"],
    valoration: { value: 0, valoratedBy: [] },
    country: "United Kingdom",
    languageSpoken: "english",
    practice: { japanese: "begginer" },
    profileText: "Hello, im Paul and don`t know what to write here.",
    profileImage: "banana",
  },
  {
    _id: "61840804f95b9af10b4c63ba",
    username: "Ramiro",
    password: hash3,
    conversations: ["61840a44ed38abe28e6ef4d4", "61840a44ed38abe28e6ef4d5"],
    valoration: { value: 0, valoratedBy: [] },
    country: "Spain",
    languageSpoken: "spanish",
    practice: 
      {
        english: "hight",japanese: "native"
      }
    ,
    profileText: "Hola, mi nombre es Ramiro y quiero aprender inglés",
    profileImage: "car",
  },
  {
    _id: "61840804f95b9af10b4c63bd",
    username: "Francois",
    password: hash4,
    conversations: ["61840a44ed38abe28e6ef4d5"],
    valoration: { value: 0, valoratedBy: [] },
    country: "France",
    languageSpoken: "french",
    practice: { spanish: "intermediate" },
    profileText: "Bonjour, je suis desolè.",
    profileImage: "sky-building",
  },
];
let conversationsArray = [
  // conversacion Aya y Paul
  {
    _id: "61840a44ed38abe28e6ef4d3",
    status: true,
    users: ["618255b489701d9c52cb635b", "618150dd73375b05dff695a8"],
    messages: [
      "618256de21c28480265bea10",
      "618256de21c28480265bea11",
      "618256de21c28480265bea12",
    ],
    profileText: "",
  },
  // conversacion Paul y Ramiro
  {
    _id: "61840a44ed38abe28e6ef4d4",
    status: true,
    users: ["618150dd73375b05dff695a8", "61840804f95b9af10b4c63ba"],
    messages: [
      "61840c2f49cd4169b95e1048",
      "61840c2f49cd4169b95e1049",
      "61840c2f49cd4169b95e104a",
    ],
  },
  // conversacion Ramiro y Francois
  {
    _id: "61840a44ed38abe28e6ef4d5",
    status: true,
    users: ["61840804f95b9af10b4c63ba", "61840804f95b9af10b4c63bd"],
    messages: ["61840c2f49cd4169b95e104b", "61840c2f49cd4169b95e104c"],
  },
];
let messagesArray = [
  // Aya y Paul
  {
    _id: "618256de21c28480265bea10",
    sentBy: "618255b489701d9c52cb635b",
    sentTo: "618150dd73375b05dff695a8",

    body: "こんにちは、あやだよ。",
  },
  {
    _id: "618256de21c28480265bea11",
    sentBy: "618150dd73375b05dff695a8",
    sentTo: "618255b489701d9c52cb635b",
    body: "Hi there",
  },
  {
    _id: "618256de21c28480265bea12",
    sentBy: "618255b489701d9c52cb635b",
    sentTo: "618150dd73375b05dff695a8",
    body: "よろしく",
  },
  // Paul y Ramiro
  {
    _id: "61840c2f49cd4169b95e1048",
    sentBy: "618150dd73375b05dff695a8",
    sentTo: "61840804f95b9af10b4c63ba",
    body: "Hi I`m Paul",
  },
  {
    _id: "61840c2f49cd4169b95e1049",
    sentBy: "61840804f95b9af10b4c63ba",
    sentTo: "618150dd73375b05dff695a8",
    body: "Hola soy Ramiro",
  },
  {
    _id: "61840c2f49cd4169b95e104a",
    sentBy: "618150dd73375b05dff695a8",
    sentTo: "61840804f95b9af10b4c63ba",
    body: "Hi Ramiro",
  },
  // Ramiro y francois
  {
    _id: "61840c2f49cd4169b95e104b",
    sentBy: "61840804f95b9af10b4c63ba",
    sentTo: "61840804f95b9af10b4c63bd",
    body: "Hola soy Ramiro",
  },
  {
    _id: "61840c2f49cd4169b95e104c",
    sentBy: "61840804f95b9af10b4c63bd",
    sentTo: "61840804f95b9af10b4c63ba",
    body: "Hola soy Francois",
  },
];

const crearSeeds = async () => {
  await mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ly1xx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    )
    .then(function () {
      console.log("We´re connected");
    })
    .catch((error) => {
      console.log(`Ha ocurrido el siguiente error:${error}`);
    });
  let deleteUsers = await User.deleteMany();
  console.log(deleteUsers);
  let createUsers = await User.create(usersArray);
  console.log(createUsers);
  let deleteConversations = await Conversation.deleteMany();
  console.log(deleteConversations);
  let createConversations = await Conversation.create(conversationsArray);
  console.log(createConversations);
  let deleteMessages = await Message.deleteMany();
  console.log(deleteMessages);
  let createMessages = await Message.create(messagesArray);
  console.log(createMessages);
  mongoose.disconnect();
};
crearSeeds();
