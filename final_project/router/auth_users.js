const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    return username && typeof username === 'string' && username.trim().length > 0;
}

const authenticatedUser = (username,password)=>{ 
    const user = users.find(u => u.username === username && u.password === password);
    return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    
    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }
    
    if (!isValid(username)) {
        return res.status(400).json({message: "Invalid username format"});
    }
    
    if (authenticatedUser(username, password)) {
        // Generate JWT token with user info and 1 hour expiry
        let token = jwt.sign(
            {username: username, timestamp: Date.now()}, 
            'fingerprint_customer', 
            {expiresIn: '1h'}
        );
        
        // Save token in session
        req.session.authorization = {
            token,
            username,
            timestamp: Date.now()
        };
        
        return res.status(200).json({
            message: "Login successful",
            token: token,
            username: username
        });
    }
    
    return res.status(401).json({message: "Invalid credentials"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  // Validate inputs
  if (!isbn || !review) {
    return res.status(400).json({message: "ISBN and review are required"});
  }

  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  // Add or update the review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    book: books[isbn].title,
    review: review,
    username: username
  });
});

// Add delete review endpoint after the PUT endpoint
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  // Check if user has a review to delete
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({message: "No review found for this user"});
  }

  // Delete the review
  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
    book: books[isbn].title
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
