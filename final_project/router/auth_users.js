const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) =>
  users.some(
    (user) => user.username === username && user.password === password
  );

const doesExist = (userName) =>
  users.some((user) => user.username === userName);

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(422).json({ message: "Login data incomplete" });
  }
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send(`User successfully logged in`);
  } else {
    return res.status(208).json({ message: "Invalid login data" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const { username } = req.session.authorization;
  if (review && username) {
    books[isbn].reviews[username] = review;
    return res.send(`${username} user review: ${review} to the book '${books[isbn].title}'`);
  }
  return res.status(422).json({ message: "Review data incomplete" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.doesExist = doesExist;
