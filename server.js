const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MOVIES = require('./movies.json');
require('dotenv').config();

const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());


app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
  })
// queries = genre, country, avg_vote
  app.get('/movies', function handleGetMovies(req, res) {
    let response = MOVIES.movies;
  
    if (req.query.genre) {
      response = response.filter(movie =>
        // case insensitive searching
        movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
      )
    }
  
    // filter our pokemon by type if type query param is present
    if (req.query.country) {
      response = response.filter(movie =>
        movie.country.toLowerCase().includes(req.query.country.toLowerCase())
      )
    }
    if (req.query.avg_vote){
        response = response.filter(movie => 
        parseInt(movie.avg_vote) >= parseInt(req.query.avg_vote)
            )
    }
  
    res.json(response)
  })

const PORT = 8000 

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})