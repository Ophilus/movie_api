const express = require('express'),
morgan = require('morgan');

const app = express();
let topMovies =
[
  { title: 'The Green Mile', director: 'Frank Darabont', releaseDate: '1999', genres: '' },
  { title: 'The Shawshank Redemption', director: 'Frank Darabont', releaseDate: '1994', genres: '' },
  { title: 'The Lord of the Rings: The Return of the King', director: 'Peter Jackson', releaseDate: '2003', genres: '' },
  { title: 'The Lord of the Rings: The Two Towers', director: 'Peter Jackson', releaseDate: '2002', genres: '' },
  { title: 'The Lord of the Rings: The Fellowship of the Ring', director: 'Peter Jackson', releaseDate: '2001', genres: '' },
  { title: 'Forrest Gump', director: 'Robert Zemeckis', releaseDate: '1994', genres: '' },
  { title: 'Lock, Stock and Two Smoking Barrels', director: ' Guy Ritchie', releaseDate: '1998', genres: '' },
  { title: 'The Matrix', director: 'Lana Wachowski', releaseDate: '1999', genres: '' },
  { title: 'Inception', director: 'Christopher Nolan', releaseDate: '2010', genres: '' },
  { title: 'Interstellar', director: 'Christopher Nolan', releaseDate: '2014', genres: '' }
];
let directors = [
  {name: 'Frank Darabont', dateOfBirth: 'January 28, 1959'},
  {name: 'Peter Jackson', dateOfBirth: 'Oktober 31, 1961'},
  {name: 'Robert Zemeckis', dateOfBirth: 'May 14, 1951 '},
  {name: 'Guy Ritchie', dateOfBirth: 'September 10, 1968 '},
  {name: 'Lana Wachowski', dateOfBirth: 'June 21, 1965 '},
  {name: 'Christopher Nolan', dateOfBirth: 'July 30, 1970 '}
];
let users = [
  {name: 'Vadym',
   email: 'example@gmail.com',
   favorites: ['The Lord of the Rings: The Return of the King' , 'Inception']
 },
];
app.use(express.static('public'));

app.use(morgan('common'));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});
 app.get('/movies', (req, res) => {
   res.json(topMovies);
 });
 app.get('/movies/:title', (req, res) => {
   res.json(topMovies.find((movies) =>
     { return movies.title === req.params.title }));
 });
 app.get('/genres/:title', (req, res) => {
   res.send('Successful GET request returning data about a genre by name/title');
 });
 app.get('/directors/:name', (req, res) => {
   res.json(directors.find((director) =>
     { return director.name === req.params.name }));
 });
 app.post('/users', (req, res) => {
   res.send('Successful POST request allowing new users to register');
 });
 app.post('/users/:id/favoriteMovies/:name', (req, res) => {
   res.send('Successful POST request allowing users to add a movie to their list of favorites');
 });
 app.put('/users/:name', (req, res) => {
   res.send('Successful PUT request allowing users to update their user info');
 });
 app.delete('/users/:id/favoriteMovies/:name', (req, res) => {
   res.send('Successful DELETE request allowing users to remove a movie from their list of favorites');
 });
 app.delete('/users/:id', (req, res) => {
   res.send('Successful DELETE request allowing existing users to deregister');
 });
 // listen for requests
 app.listen(8080, () => {
   console.log('Your app is listening on port 8080.');
 });

 app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
