const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

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

// TASK 10 USING ASYNC CALL BACK FUNCTION
async function getAsyncBooks() {
    return books;
};
// Get the book list available in the shop using the promise.then function to provide an async response
public_users.get('/', async function (req, res) {
    try {
        const bookList = await getAsyncBooks();
        return res.status(200).send(JSON.stringify({bookList},null,4));
    } catch (error) {
        return res.status(500).send('Error retrieving book list');
    }
});

// promise function to get book data
let getBooks = new Promise((resolve,reject) => {
    resolve(books);
});

// Get book details based on ISBN using promise and callbacks
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        getBooks.then((bookList) => {
            const isbn = parseInt(req.params.isbn);
            if (isbn >= 1 && isbn <= 10){
                let isbn_book = bookList[isbn];
                return res.status(200).send(JSON.stringify({isbn_book},null,4));
            } else {
                return res.status(204).send("Please select appropriate isbn")
            }
        });
    } catch (error) {
        return res.status(500).send('Error retrieving book list');
    }
});

// DONE
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        getBooks.then((bookList) => {
            const author = req.params.author;
            let authors_books=[];
            for(let i = 1; i < 10; i++) {
                if(bookList[i].author.toLowerCase() === author.toLowerCase()){
                    authors_books.push(bookList[i]);
                }
            }
            if(authors_books.length > 0){
                return res.status(200).send(JSON.stringify({authors_books},null,4));
            } else {
                return res.status(204).send("No books in the database written by that author");
            }
        });
    } catch (error) {
        return res.status(500).send('Error retrieving book list');
    }
});

// DONE
// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        getBooks.then((bookList) => {
            const title = req.params.title;
            let book_title = [];
            for(let i = 1; i < 10; i++){
                if(bookList[i].title.toLowerCase() === title.toLowerCase()){
                    book_title.push(bookList[i]);
                }
            }
            if(book_title.length > 0){
                return res.status(200).send(JSON.stringify({book_title},null,4));
            } else {
                return res.status(204).send("No books with that title are in the database");
            }
        });
    } catch (error) {
        return res.status(500).send('Error retrieving book list');
    }
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
