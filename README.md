# news-forum

## About news-forum
The news-forum app allows the user to maintain a private list of articles to read and write comments.   

Because the app scrapes a website (hardcoded in `server.js`) for news articles, news-forum provides the ability to open the full article in the "scraped" website source is provided.  This app is designed to promote the source material (for prototyping purposes), not steal it.

The news-forum app also provides a rudimentary strcuture for taking comments about those articles from the user.

See the deployed example [on Heroku](https://metal-news-forum.herokuapp.com/)
See the [Codesource at github](https://github.com/jmdahle/news-forum)


## Default State
The default state has Articles documents already scraped and stored from the source in `server.js`.  From an empty state (no database or an empty one), connect to `/scrape/add` and the server.js will scrape article information from the hardcoded sources and add them to the database.

Mongoose also enforces uniqueness rules, so duplicates are rejected and errors returned if a duplicate reference is found.

## Installation
You can clone the [complete repository at github](https://github.com/jmdahle/news-forum) and get source files using the technologies noted below.


#### See Also
See the [current issues at github](https://github.com/jmdahle/news-forum/issues)
See the [Codesource at github](https://github.com/jmdahle/news-forum)

### Technologies Used
** Client Side **
* HTML, CSS, JavaScript, JQuery, Bootstrap
** Server Side **
* Node.js, NPM Packages listed below
    
### Node Module Dependencies
1. Run `npm init` to install the dependencies listed in `json.package`. When that's finished, you will have installed these npm packages:
   1. [express](https://www.npmjs.com/package/express)
   1. [mongoose](https://www.npmjs.com/package/mongoose)
   1. [cheerio](https://www.npmjs.com/package/cheerio)
   1. [axios](https://www.npmjs.com/package/axios)

To install independently, use `npm i _packagename_` from the command line in your root server directory.

#### Technical Notes
##### Routing
`/` - links to /public/index.html by way of the static route in server.js
`/articles` - returns json formed array of Artcile documents in the database
`/article/:article_id` - returns json formed array of a single Article document matching the _id in the database
`/comments/:article_id` - returns json formed array of a Comment documents matching the _id (for Article) in the database
`/add/scrape` - for seeding an empty database into its default state

##### Developement Notes
* [jd-2019-08-25] Strategy was to wire up working modules end to end with an MVC separation.  No functionality.  Only connectivity and file structure.
    Working Functionality:
    * creates DB on `npm start`
    * listens on `localhost` and PORT 3000
    * server responds to '/' request
    * client receives correct response to '/'
    * test click Article returned correct result to client
    * test click on Comment returned correct result to client
    * adds to Article and Comment in DB working, but association between them is not
    * successfully adds multiple comments to DB (with identical information, the test case), but appears to return the same ID to cient
    * does not permit duplicate Article title to DB, returns error to client
    * click for scraping is correctly calling back from server at /add/scrape... but doing nothing
* [jd-2019-08-25] Added basic scraping functionality on test website
    * `/add/scrape` route scrapes `<article>` tags to get `title` and `link` to article
    * uses cheerio to parse the remote HTML (this is generally site specific, so I used postman to review the remote HTML structure)
    * server properly added to database.  Relying on model restrictions, no duplicates are allowed, though errors are thrown
    * added summary to Article data
    * added choose article with some not fully tested functionality (add comment, view comments, open link)
    * scraper is functional
    * list of articles is functional
* [jd-2019-08-26] Completed db interaction; finished initial layout
* [jd-2019-08-29] Implemented front-end interractivity
    * implemented Bootstrap
    * implemented client-side javascript 
    * utilized calls to back end apis
    * some adjustements to routing code in server.js



