const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
        return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user, no username or password provided."});
});

// DONE WITH PROMISE CALL BACKS
// promise function to get book data
let getBooks = new Promise((resolve,reject) => {
    resolve(books);
});
// Get the book list available in the shop using the promise.then function to provide an async response
public_users.get('/', function (req, res) {
    getBooks.then((book_list) => {
        return res.status(200).send(JSON.stringify({book_list},null,4));
    });
});

// DONE
// Get book details based on ISBN using promise and callbacks
public_users.get('/isbn/:isbn',function (req, res) {
    getBooks.then((book_list) => {
        const isbn = parseInt(req.params.isbn);
        if (isbn >= 1 && isbn <= 10){
            let isbn_book = book_list[isbn];
            return res.status(200).send(JSON.stringify({isbn_book},null,4));
        } else {
            return res.status(204).send("Please select appropriate isbn")
        }
    })
});

// DONE
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    getBooks.then((book_list) => {
        const author = req.params.author;
        let authors_books=[];
        for(let i = 1; i < 10; i++) {
            if(book_list[i].author.toLowerCase() === author.toLowerCase()){
                authors_books.push(book_list[i]);
            }
        }
        if(authors_books.length > 0){
            return res.status(200).send(JSON.stringify({authors_books},null,4));
        } else {
            return res.status(204).send("No books in the database written by that author");
        }
    });
});

// DONE
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    getBooks.then((book_list) => {
        const title = req.params.title;
        let book_title = [];
        for(let i = 1; i < 10; i++){
            if(books[i].title.toLowerCase() === title.toLowerCase()){
                book_title.push(book_list[i]);
            }
        }
        if(book_title.length > 0){
            return res.status(200).send(JSON.stringify({book_title},null,4));
        } else {
            return res.status(204).send("No books with that title are in the database");
        }
    });
});

// DONE
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn);
    if (isbn >= 1 && isbn <= 10){
        let review_list = books[isbn].reviews
        return res.status(200).send(JSON.stringify({review_list},null,4));
    } else {
        return res.status(204).send("Please select appropriate isbn");
    }
});
module.exports.general = public_users;
