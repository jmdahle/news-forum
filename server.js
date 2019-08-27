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
// route returns Hello World if no default is available
app.get('/', (request, response) => {
  console.log('/');
  response.send('Hello World!');
});

// route returns all articles
app.get('/articles', (request, response) => {
  console.log('/articles');
  db.Article.find({})
    .then((dbArticle) => {
      // If all Notes are successfully found, send them back to the client
      response.json(dbArticle);
    })
    .catch((err) => {
      // If an error occurs, send the error back to the client
      response.json(err);
    });
});

// route to return all comments for the given article
app.get('/comments/:article_id', (request, response) => {
  console.log(`/comments/${request.params.article_id}`);
  let article_id = request.params.article_id;
  db.Comment.find({ article_id: article_id })
    .then(dbComments => {
      response.json(dbComments);
    })
    .catch(err => {
      response.json(err);
    });
});

// route to add a comment for an article
app.post('/add/Comment', (request, response) => {
  console.log('Comment:', request.body);
  // add the Comment
  db.Comment.create(request.body)
    // first handle the relation to Article
    .then((dbComment) => {
      // If a Comment was created successfully, find one Article (there's only one) and push the new Comment's _id to the Article's `comments` array
      // { new: true } tells the query that we want it to return the updated Article -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      console.log('add comment to the article')
      let relatedArticleId = dbComment.article_id;
      console.log('relatedArticleId:', relatedArticleId);
      return db.Article.findOneAndUpdate({ _id: relatedArticleId }, { $push: { comments: dbComment._id } }, { new: true });
    })
    .then((dbArticle) => {
      // return the new Comment
      response.json(dbArticle)
    })
    .catch((err) => {
      // return the error to the client
      response.json(err);
    });
});

// route to scrape the remote website for content links
app.post('/add/scrape', (request, response) => {
  console.log('scrape request', request.body);
  let numberFound = 0;  //count for number of Articles found
  let numberAdded = 0; // count for number of Articles added
  let numberRejected = 0; // conunt for the number of Articles not added
  // The three of these numbers had better add up, chump.

  // start the scraper
  const link = 'https://www.angrymetalguy.com/category/reviews/';

  for (let i = 1; i <= 10; i++) {
    // get 10 pages worth of articles
    axios.get(link + 'page/' + i + '/')
      .then(extResponse => {
        const $ = cheerio.load(extResponse.data);

        // specific search on external page using cheerio
        // Use Postman to make this easier
        // test case:
        // link: 'https://https://www.angrymetalguy.com/category/reviews/'
        // each <article>
        $('article').each(function (i, element) {
          // !! IMPORTANT !!
          // Above is an example where an ES6 arrow function produces problems with accessing `this`
          // !! IMPORTANT !!
          let result = {}; // the data that is added to db  
          // the title and link is in the <h4> with class entry-title
          result.title = $(this)
            .find('h4')
            .children('a')
            .text();
          result.link = $(this)
            .find('h4')
            .children('a')
            .attr('href');
          result.summary = $(this)
            .find('aside')
            .text();

          numberFound++; // increase the number of articles found
          // add article to the DB
          console.log('result:', result.title, result.summary);
          db.Article.create(result)
            .then(dbArticle => {
              // article successfully added to db
              console.log('added', dbArticle._id)
              numberAdded++; // increse number of articles added
            })
            .catch(error => {
              console.log('error - possibly just a duplicate');
              // console.log( error )
              numberRejected++;  // increase the number of articles rejected
            });
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  response.send('Scrape complete');
})


// Connect to the Mongo DB using mongoose
mongoose.connect('mongodb://localhost/news-forum-populator', { useNewUrlParser: true });


// start the listener
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});