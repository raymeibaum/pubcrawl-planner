const bcrypt = require('bcrypt');
const User = require('../models/user.js');

function createSecure(req, res, next) {
  if (req.body.password === req.body.confirmPassword) {
    let password = req.body.password
    res.hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  } else {
    res.json({status: 400, data: "passwords do not match"});
  }
  next()
}

function loginUser(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  let query = User.findOne({ username: username }).exec()

  query.then(function(foundUser){
    if (foundUser == null) {
      res.json({status: 401, data: "unauthorized"})

    } else if (bcrypt.compareSync(password, foundUser.passwordDigest)) {
      req.session.currentUser = foundUser;
    }
    next()
  })
  .catch(function(err){
    res.json({status: 500, data: err})
  });
}

function authorize(req, res, next) {
  let currentUser = req.session.currentUser;

  if (!currentUser || currentUser._id !== req.params.id ) {
    res.json({status: 401, data: 'unauthorized'});
  } else {
    next();
  }
};

module.exports = {
  createSecure: createSecure,
  loginUser: loginUser,
  authorize: authorize
}
