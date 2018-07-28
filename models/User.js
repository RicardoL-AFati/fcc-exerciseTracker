const mongoose = require('mongoose');
const ExerciseSchema = require('./Exercise');
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: String,
  userId: String,
  exercises: [ExerciseSchema],
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
