const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const doesExist = require("./auth_users.js").doesExist;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username, password });
      res.status(200).json({ message: `User ${username} successfully added` });
    } else {
      res
        .status(409)
        .json({ message: `User with the ${username} already exists` });
    }
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;
  const selectedBook = books[isbn];
  if (selectedBook) {
    return res.send(JSON.stringify(selectedBook));
  } else {
    return res.status(404).json({ message: "Resource not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params;
  const booksByAuthor = Object.values(books).filter(
    (book) => book.author === author
  );
  if (booksByAuthor.length) {
    return res.send(JSON.stringify(booksByAuthor));
  } else {
    return res.status(404).json({ message: "Resource not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;
  const booksByTitle = Object.values(books).filter(
    (book) => book.title === title
  );
  if (booksByTitle.length) {
    return res.send(JSON.stringify(booksByTitle));
  } else {
    return res.status(404).json({ message: "Resource not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  const selectedBook = books[isbn];
  if (selectedBook) {
    return res.send(JSON.stringify(selectedBook.reviews));
  } else {
    return res.status(404).json({ message: "Resource not found" });
  }
});

module.exports.general = public_users;
