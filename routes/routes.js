const User = require('../models/User');
const randomstring = require('randomstring');
const moment = require('moment');

module.exports = (app) => {
  app.post('/api/exercise/new-user', (req, res) => {
    User.findOne({ username: req.body.username }).then((foundUser) => {
      if (foundUser) {
        res.send({ userId: foundUser.userId });
      } else {
        User.create({ username: req.body.username, userId: randomstring.generate(7) }).then(
          (createdUser) => {
            res.send({ username: createdUser.username, userId: createdUser.userId });
          },
        );
      }
    });
  });

  app.post('/api/exercise/add', (req, res) => {
    User.findOne({ userId: req.body.userId }).then((foundUser) => {
      if (foundUser) {
        foundUser.exercises.push({
          description: req.body.description,
          duration: req.body.duration,
          date: req.body.exerDate,
        });
        foundUser.save().then((savedUser) => {
          res.send(savedUser);
        });
      } else {
        res.send({ error: 'User with that id was not found' });
      }
    });
  });

  app.get('/api/exercise/log', (req, res) => {
    User.findOne({ userId: req.query.userId }).then((foundUser) => {
      if (foundUser) {
        const { to, from, limit } = req.query;
        if (from === '' && to === '') {
          res.send({
            foundExercises: limit ? foundUser.exercises.slice(0, limit) : foundUser.exercises,
          });
        } else {
          const filteredExercises = foundUser.exercises.reduce((filtered, exercise) => {
            if (from !== '' && to !== '') {
              const isAfter = moment.utc(exercise.date).isAfter(moment.utc(from));
              const isBefore = moment.utc(exercise.date).isBefore(moment.utc(to));
              if (isAfter && isBefore) {
                filtered.push(exercise);
                return filtered;
              }
            } else if (from !== '' && to === '') {
              if (moment.utc(exercise.date).isAfter(moment.utc(from))) {
                filtered.push(exercise);
                return filtered;
              }
            } else if (from === '' && to !== '') {
              if (moment.utc(exercise.date).isBefore(moment.utc(to))) {
                filtered.push(exercise);
                return filtered;
              }
            }
            return filtered;
          }, []);
          res.send({
            foundExercises: limit ? filteredExercises.slice(0, limit) : filteredExercises,
          });
        }
      } else {
        res.send({ error: 'User with that id was not found' });
      }
    });
  });
};
