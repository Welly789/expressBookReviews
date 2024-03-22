const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = parseInt(req.params.isbn);
    if (isbn >= 1 && isbn <= 10){
        let review = req.query.review;
        if(review){
            if(books[isbn].reviews[username]){
                books[isbn].reviews[username] = review;
                res.send(`Review of ${books[isbn].title} updated in book database by ${username}\n
                Review:\n
                ${books[isbn].reviews[username]}`);
            } else {
                books[isbn].reviews[username] = review;
                res.send(`Review of ${books[isbn].title} added to book database by ${username}\n
                Review:\n
                ${books[isbn].reviews[username]}`);
            }
        } else {
            res.send("No review written");
        }
    } else {
    return res.send("Please select appropriate isbn");
    } 
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
    const isbn = parseInt(req.params.isbn);
    const username = req.session.authorization.username;
    if (isbn >= 1 && isbn <= 10){
        delete books[isbn].reviews[username]
        return res.send(`${username}'s review of ${books[isbn].title} has been deleted`);
    } else {
        return res.send("Please select appropriate isbn")
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
