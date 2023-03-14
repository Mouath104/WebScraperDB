const express = require('express');
const mongoose = require('mongoose');
const request = require('request');
const cheerio = require('cheerio');
const Data = require('./model');

// Create a new Express application
const app = express();

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define the /scrape route
app.get('/scrape', (req, res) => {
    console.log('Received a scrape request');
    const url = 'https://ar.quora.com/topic/%D8%A7%D9%83%D8%AA%D8%A6%D8%A7%D8%A8?q=%D8%A7%D9%83%D8%AA%D8%A6%D8%A7%D8%A8';
  
    request(url, (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);
  
        // Scrape data from the website and store it in the database
        const title = $('title').text();
        const description = $('meta[name=description]').attr('content');
  
        const data = new Data({
          title,
          description
        });
  
        data.save()
          .then(() => {
            console.log('Data saved to database');
            res.status(200).send('Data saved to database');
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send('Error saving data to database');
          });
      } else {
        res.status(500).send('Error scraping website');
      }
    });
  });
