const mongoose = require('mongoose');
const { Schema } = mongoose;

const ExerciseSchema = new Schema({
  description: String,
  duration: Number,
  date: Date,
});

module.exports = ExerciseSchema;
