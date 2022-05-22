const express = require('express'),
morgan = require('morgan'),
mongoose = require('mongoose'),
Models = require('./models.js'),
bodyParser = require('body-parser'),
{ check, validationResult } = require('express-validator');

const Movies = Models.Movie,
Users = Models.User;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

//mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static('public'));

app.use(morgan('common'));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});

/**
 * GET: Returns a list of ALL movies to the user
 * Request body: Bearer token
 * @returns array of movie objects
 * @requires passport
 */
 app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
   Movies.find()
     .then((movie) => {
       res.status(201).json(movie);
     })
     .catch((err) => {
       console.error(err);
       res.status(500).send('Error: ' + err);
     });
 });


 /**
 * GET: Returns data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
 * Request body: Bearer token
 * @param title
 * @returns movie object
 * @requires passport
 */
 app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
   Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
 });


/**
 * GET: Returns data about a genre (description) by name/title (e.g., “Fantasy”)
 * Request body: Bearer token
 * @param name (of genre)
 * @returns genre object
 * @requires passport
 */
 app.get('/genres/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
   Movies.find({ 'Genre.Name': req.params.name})
    .then((movie) => {
      res.json(movie[0].Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
 });


/**
 * GET: Returns data about a director (bio, birth year, death year) by name
 * Request body: Bearer token
 * @param name (of director)
 * @returns director object
 * @requires passport
 */
 app.get('/directors/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
   Movies.find({ 'Director.Name': req.params.name })
    .then((movie) => {
      res.json(movie[0].Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
 });

/**
 * POST: Allows new users to register; Username, Password & Email are required fields!
 * Request body: Bearer token, JSON with user information
 * @returns user object
 */
 app.post('/users',
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });


/** 
 * GET: Returns a list of ALL users
 * Request body: Bearer token
 * @returns array of user objects
 * @requires passport
 */
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
/**
 * GET: Returns data on a single user (user object) by username
 * Request body: Bearer token
 * @param username
 * @returns user object
 * @requires passport
 */
app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.username })
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * GET: Returns data with user's favourite movies id
 * Request body: Bearer token
 * @param username
 * @returns array with movies id
 * @requires passport
 */
app.get('/users/:username/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.username })
    .then((users) => {
      res.status(201).json(users.FavoriteMovies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * POST: Allows users to add a movie to their list of favorites
 * Request body: Bearer token
 * @param Username
 * @param movieID
 * @returns user object
 * @requires passport
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
 Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true }, // This line makes sure that the updated document is returned
 (err, updatedUser) => {
   if (err) {
     console.error(err);
     res.status(500).send('Error: ' + err);
   } else {
     res.json(updatedUser);
   }
 });
});


/**
 * PUT: Allow users to update their user info (find by username)
 * Request body: Bearer token, updated user info
 * @param Username
 * @returns user object with updates
 * @requires passport
 */
 app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate(
    { Username: req.params.Username },
      {
        $set: {
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday,
    },
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

/**
 * DELETE: Allows users to remove a movie from their list of favorites
 * Request body: Bearer token
 * @param Username
 * @param movieId
 * @returns user object
 * @requires passport
 */
 app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
   Users.findOneAndUpdate({ Username: req.params.Username }, {
      $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, // This line makes sure that the updated document is returned
   (err, updatedUser) => {
     if (err) {
       console.error(err);
       res.status(500).send('Error: ' + err);
     } else {
       res.json(updatedUser);
     }
   });
 });


 /**
 * DELETE: Allows existing users to deregister
 * Request body: Bearer token
 * @param Username
 * @returns success message
 * @requires passport
 */
 app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


 // listen for requests
 const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

 app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
