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
    
    if (!isValid(username)) {
        return res.status(400).json({message: "Invalid username"});
    }
    
    if (authenticatedUser(username, password)) {
        let token = jwt.sign({username: username}, 'fingerprint_customer', {expiresIn: '1h'});
        req.session.authorization = {token};
        return res.status(200).json({message: "Login successful", token});
    }
    
    return res.status(401).json({message: "Invalid credentials"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
