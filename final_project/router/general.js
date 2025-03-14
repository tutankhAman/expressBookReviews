const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  // Check if username is valid using existing isValid function
  if (!isValid(username)) {
    return res.status(400).json({message: "Invalid username format"});
  }

  // Check if username already exists
  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }

  // Add new user
  users.push({ username, password });
  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({books: books}, null, 2));
});

// Add this new async endpoint after the existing book list endpoint
// Get the book list (async version with Promise)
public_users.get('/async', async function (req, res) {
  // Simulate getting books from an external API
  const getBooksAsync = () => {
    return new Promise((resolve, reject) => {
      try {
        // Simulate API delay
        setTimeout(() => {
          resolve(books);
        }, 1000);
      } catch (error) {
        reject(error);
      }
    });
  };

  try {
    const booksList = await getBooksAsync();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify({
      message: "Books retrieved successfully",
      books: booksList
    }, null, 2));
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books",
      error: error.message
    });
  }
});

// Alternative version using axios (if you have a real API endpoint)
public_users.get('/async-axios', async function (req, res) {
  try {
    // For demonstration, we'll simulate an API call
    // In reality, you would use a real API endpoint
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books",
      error: error.message
    });
  }
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

// Add these new async endpoints after the existing ISBN endpoint
// Get book by ISBN (async version with Promise)
public_users.get('/async/isbn/:isbn', async function (req, res) {
  const getBookByIsbnAsync = (isbn) => {
    return new Promise((resolve, reject) => {
      try {
        const book = books[isbn];
        if (book) {
          setTimeout(() => {
            resolve(book);
          }, 1000);
        } else {
          reject(new Error('Book not found'));
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  try {
    const isbn = req.params.isbn;
    const book = await getBookByIsbnAsync(isbn);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify({
      message: "Book retrieved successfully",
      book: book
    }, null, 2));
  } catch (error) {
    return res.status(404).json({
      message: "Error retrieving book",
      error: error.message
    });
  }
});

// Alternative version using axios
public_users.get('/async-axios/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    // In a real application, this would be an external API endpoint
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({
      message: "Error retrieving book",
      error: error.message
    });
  }
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
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify({
      isbn: isbn,
      reviews: books[isbn].reviews
    }, null, 2));
  }
  return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
});

module.exports.general = public_users;
