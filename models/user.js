const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// Hook before saving, crypting password
userSchema.pre('save', function(next) {
  const user = this;

  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(error) }

      user.password = hash;
      next();
    })
  })
});

// Compare method
userSchema.methods.comparePassword = function(candidatePass, callback) {
  bcrypt.compare(candidatePass, this.password, function(err, isMatch) {
    if (err) { return callback(err) }

    callback(null, isMatch);
  })
}

const userClass = mongoose.model('user', userSchema);

module.exports = userClass;
