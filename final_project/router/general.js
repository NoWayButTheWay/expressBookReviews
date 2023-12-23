const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  
  if(req.body.username === ''){
    return  res.send('proved username')
  }
  if(req.body.password === ''){
    return  res.send('proved password')
  }
  users.map((user)=> console.log("from list username: "+user.username))
  let user_exists = users.filter((user)=>req.body.username === user.username)[0]
  if(user_exists != undefined){
    console.log("user already exsits")
    return res.status(200).json({message: "user already exsits"})
  }
  users.push({username:req.body.username,password:req.body.password})
  return res.status(200).json({message: "user created"})
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let theBook = books[req.params.isbn]
  if(theBook === undefined){
    return res.send('book not found')
  }
  return res.status(200).json(theBook);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  for(const [key, value] of Object.entries(books)){
    // console.log(value)
    if(value.author === req.params.author){
      return res.send(value)
    }
  }
    
  return res.status(200).json({message: "book with that author not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  for(const [key, value] of Object.entries(books)){
    // console.log(value)
    if(value.title === req.params.title){
      return res.send(value)
    }
  }
    
  return res.status(200).json({message: "book with that title not found"});
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  for(const [key, value] of Object.entries(books)){
    // console.log(value)
    if(key === req.params.isbn){
      return res.send(value.reviews)
    }
  }
    
  return res.status(200).json({message: "book not found"});
  
});

//get all books
public_users.get('/axios',function (req, res){

  async function getBooks(){
    let response = await axios.get('http://localhost:5000')
    console.log(response.data)
  }
  getBooks()
  // console.log('axios get all books')
  // let getBooks = new Promise((resolve, reject) =>{
  //   resolve(axios.get('http://localhost:5000'))
  // })
  // getBooks.then((response)=>  console.log(response.data))
  // let bookList = getBooks.then((response)=> res.status(200).json({message: response.data}))
  // return bookList
});



//get all book by isbn
public_users.get('/axios/:isbn',function (req, res){
  console.log('axios get all book by isbn')
  let getBooks = new Promise((resolve, reject) =>{
    resolve(axios.get('http://localhost:5000/isbn/'+req.params.isbn))
  })
  getBooks.then((response)=>  console.log(response.data))
  // let bookList = getBooks.then((response)=> res.status(200).json({message: response.data}))
  // return bookList
});

//get all book by author
public_users.get('/axios/:author',function (req, res){
  console.log('axios get all book by author')
  let getBooks = new Promise((resolve, reject) =>{
    resolve(axios.get('http://localhost:5000/author/'+req.params.author))
  })
  getBooks.then((response)=>  console.log(response.data))
  // let bookList = getBooks.then((response)=> res.status(200).json({message: response.data}))
  // return bookList
});

//get all book by title
public_users.get('/axios/:title',function (req, res){
  console.log('axios get all book by title')
  let getBooks = new Promise((resolve, reject) =>{
    resolve(axios.get('http://localhost:5000/title/'+req.params.title))
  })
  getBooks.then((response)=>  console.log(response.data))
  // let bookList = getBooks.then((response)=> res.status(200).json({message: response.data}))
  // return bookList
});




module.exports.general = public_users;
