var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')
const { User } = require('../models');
const db = require('../models');
const saltRoundsNumber = process.env.SALT_ROUNDS;
const saltRounds = bcrypt.genSaltSync(saltRoundsNumber);
const jwt = require("jsonwebtoken")

const secretKey = process.env.SECRET_KEY;



/* GET users listing. */

router.get('/', async (req, res) => {
  res.render("index")
  // const users = await User.findAll();
  // res.send(users);
});

router.post('/login', async (req, res, next) => {
  let { username, password } = req.body;

  const hash = bcrypt.hashSync(password, saltRounds)
  
  const user = await User.findOne({ where: { username: username } });
  
  const dbPassword = user.password
  const comparePass = bcrypt.compareSync(password, dbPassword)

  if (comparePass){
    const token = jwt.sign({
      data: username
      }, secretKey, { expiresIn: '1h' });
    res.cookie('AuthToken', token);
    // Send to prtoected page
    res.redirect("/users/protected")
  } else {
    console.log("Didn't work!")
    }
})


const isValidUser = (req, res, next) => {
  const token = req.cookies['AuthToken'];

  jwt.verify(
    token,
    secretKey,
    function (err, decoded) {
      if (decoded){ 
        next() 
      } else {
        res.send("Bad token")
      }
    }
  )}

router.get("/protected", isValidUser, (req, res, next) => {
  res.send("You are protected")
  console.log("in protected route")
})


// const isValidUser = (req, res, next) => {
//   jwt.verify(
//     token,
//     secretKey,
//     function (err, decoded) {
//       if (decoded){ 
//         next() 
//       } else {
//         res.send("Bad token")
//       }
//     }
//   )}





router.post('/register', async (req, res, next) => {
  let { username, password } = req.body;
  const hash = bcrypt.hashSync(password, saltRounds);
  console.log("the hash is: "+ hash);
  const newUser = await User.create({
      username: username,
      password: hash
  })
  

  res.send("user added")
})

router.get('/register/:username', async (req, res, next) => {
  try {
    const username = req.params.username
    const user = await User.findOne({ where: { username: username } });
    // console.log("Res is: " + res)
    res.json(user);
    let password = ""
    const unhashedPassword = bcrypt.hashSync(password, saltRounds)
    const comparePass = bcrypt.compareSync(User.password, unhashedPassword)

    console.log(comparePass)
} 
catch(e){
    console.log(e)
    res.status(404).json({
        message: `User not found`
    })
}
})

// router.post('/',(req, res, next) => {
  
//   const password = "password123"

//   const saltRounds = bcrypt.genSaltSync(5);
//   const hash = bcrypt.hashSync(password, saltRounds)

//   console.log("My password: " + password)
//   console.log("My hashed-password: " + hash)

//   bcrypt.hash(myPassword, saltRounds, (err, hash) => {
//   })

//   res.send("user added")
// })

module.exports = router;
