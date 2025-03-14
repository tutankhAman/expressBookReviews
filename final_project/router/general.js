const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({books: books}, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify({book: books[isbn]}, null, 2));
  }
  return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const authorBooks = Object.keys(books)
    .filter(isbn => books[isbn].author === author)
    .reduce((acc, isbn) => {
      acc[isbn] = books[isbn];
      return acc;
    }, {});

  if (Object.keys(authorBooks).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify({books: authorBooks}, null, 2));
  }
  return res.status(404).json({message: `No books found for author: ${author}`});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const titleBooks = Object.keys(books)
    .filter(isbn => books[isbn].title === title)
    .reduce((acc, isbn) => {
      acc[isbn] = books[isbn];
      return acc;
    }, {});

  if (Object.keys(titleBooks).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify({books: titleBooks}, null, 2));
  }
  return res.status(404).json({message: `No books found with title: ${title}`});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
