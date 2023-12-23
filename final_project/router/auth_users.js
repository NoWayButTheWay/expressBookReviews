const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username:"test",password:"test"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
 
  if(req.body.username === '' || req.body.username === undefined){
    return res.send('proved username')
  }
  if(req.body.password === '' || req.body.password === undefined ){
    return res.send('proved password')
  }
  let check_user = users.filter((user)=> user.username === req.body.username && user.password === req.body.password)[0]
  if(check_user === undefined){
    return res.send('wrong useranme or password')
  }
  let accessToken = jwt.sign({data:check_user.username},'access',{ expiresIn: 60 * 60 })
  // console.log(accessToken)
  req.session.authorization = {accessToken}
  return res.status('200').send('ok have access')
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let reviews = books[req.params.isbn]['reviews'];
  let user_review = jwt.decode(req.session.authorization['accessToken'])['data']
  let review = {}
  review[user_review] = {review:req.body.review}
  books[req.params.isbn]['reviews'] = {...reviews, ...review }
  console.log(books[req.params.isbn]['reviews'])
  return res.status(200).json({message: "review was saved"});
});

// remove  a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let reviews = books[req.params.isbn]['reviews'];
  // console.log('from object '+JSON.stringify(reviews))
  // console.log(req.session.authorization['accessToken'])
  let user_review = jwt.decode(req.session.authorization['accessToken'])['data']
  // review[user_review] = {review:req.body.review}
  let listkeys = Object.keys(reviews)
  listkeys.map((aaa)=>{
    console.log('asdf'+aaa)
    if(aaa === user_review){
      console.log('ifff')
      console.log('asdfaaa'+aaa)
      const {[aaa]: aaaasdf, ...without } = reviews;
      console.log("ffff"+JSON.stringify(aaaasdf))
      console.log(without)
      books[req.params.isbn]['reviews'] = {...without }
      console.log(books[req.params.isbn]['reviews'])
      return res.status(200).json({message: `review was removed for book ${req.params.isbn} from user ${user_review}`});
    }
    console.log(books[req.params.isbn]['reviews'])
  })
  return res.json({message: "you did not reviewed this book"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
