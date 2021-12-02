const jwt = require("jsonwebtoken");

let verifyToken = (req, res, next) => {
  let { token } = req.headers;
  let x;
  try {
    x = jwt.verify(token, process.env.SECRET_WORD);
    
  } catch(error) {
    return res.json({message: "Authentication error."})
  }
  req.id = x.id
  next();
};

module.exports = verifyToken;
