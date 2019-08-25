// Server dependencies
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');

// Initialize express
const app = express();
const PORT = 3000;

// database models
const db = require('./models');

// Use morgan logger for logging requests
// app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


// Routes
app.get('/', (request, response) => {
    console.log('/');
    response.send('Hello World!');
});

app.post('/add/Article', (request, response) => {
    console.log('Article:', request.body);
    // add the Article
    db.Article.create(request.body)
    // .then(function(dbNote) {
    //     // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
    //     // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
    //     // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
    //     return db.User.findOneAndUpdate({}, { $push: { notes: dbNote._id } }, { new: true });
    //   })
      .then( (dbArticle) => {
        // If the Article was inserted successfully, send it back to the client
        response.json(dbArticle);
      })
      .catch( (err) => {
        // If an error occurs, send it back to the client
        response.json(err);
      });
});

app.post('/add/Comment', (request, response) => {
    console.log('Comment:', request.body);
    // add the Comment
    db.Comment.create(request.body)
      // first handle the relation to Article
      .then( (dbComment) => {
          // If a Note was created successfully, find one Article (there's only one) and push the new Comment's _id to the Article's `comments` array
          // { new: true } tells the query that we want it to return the updated Article -- it returns the original by default
          // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
          console.log('add comment to the article')
          let relatedArticleId = dbComment.article_id;
          return db.Comment.findOneAndUpdate({}, { $push: { notes: dbComment._id } }, { new: true });
      })
      .then( (dbComment) => {
        // return the new Comment
        response.json(dbComment)
      })
      .catch( (err) => {
        // return the error to the client
        response.json(err);
      });
});

app.post('/add/scrape', (request, response) => {
    console.log('scrape request', request.body);
    // start the scraper
    // insert the articles
    // return the new articles
    response.send('UNDER CONSTRUCTION');
})

// Connect to the Mongo DB using mongoose
mongoose.connect('mongodb://localhost/news-forum-populator', { useNewUrlParser: true });


// start the listener
app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
});