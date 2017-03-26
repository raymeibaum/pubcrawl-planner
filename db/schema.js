const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const BarSchema = new Schema({
  name: String,
  address: {
    street: String,
    city: String,
    state: String
  }
});

const UserSchema = new Schema({
  username: String,
  passwordDigest: String,
  favoriteBars: [BarSchema],
  timestamps: {
    createdAt: Date,
    updatedAt: Date
  }
});

UserSchema.pre('save', function(next) {
  let now = new Date();
  this.timestamps.updatedAt = now;

  if (!this.timestamps.createdAt) {
    this.timestamps.createdAt = now
  }
  next()
});

const UserModel = mongoose.model('User', UserSchema);
const BarModel = mongoose.model('Bar', BarSchema);

module.exports = {
  User: UserModel,
  Bar: BarModel
}
