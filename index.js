const express = require('express'),
morgan = require('morgan');

const app = express();
let topMovies =
[
  { title: 'Pig', director: 'Michael Sarnoski', releaseDate: 'July 16, 2021' },
  { title: 'Zola', director: 'Janicza Bravo (Lemon)', releaseDate: 'June 30, 2021' },
  { title: 'Annette', director: 'Leos Carax (Holy Motors)', releaseDate: 'August 6, 2021' },
  { title: 'Saint Maud', director: 'Rose Glass', releaseDate: 'January 29, 2021' },
  { title: 'Barb & Star Go to Vista Del Mar', director: 'Josh Greenbaum', releaseDate: 'February 12, 2021' },
  { title: 'Test Pattern', director: 'Shatara Michelle Ford', releaseDate: 'February 12, 2021' },
  { title: 'The Green Knight', director: ' David Lowery (A Ghost Story)', releaseDate: 'July 30, 2021' },
  { title: 'The Card Counter', director: 'Paul Schrader (First Reformed)', releaseDate: 'September 10, 2021' },
  { title: 'Shiva Baby', director: 'Emma Seligman', releaseDate: 'April 3, 2021' },
  { title: 'Bad Trip', director: 'Kitao Sakurai', releaseDate: 'March 26, 2021' }
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
 // listen for requests
 app.listen(8080, () => {
   console.log('Your app is listening on port 8080.');
 });

 app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
