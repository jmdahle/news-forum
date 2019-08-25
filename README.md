# news-forum

## About news-forum
The news-forum app scrapes a website for news articles and provides a strcuture for taking comments about those articles from users.

## Installation

### Node Module Dependencies
1. Run `npm init` to install the dependencies listed in `json.package`. When that's finished, you will have installed these npm packages:
   1. express
   1. express-handlebars
   1. mongoose
   1. cheerio
   1. axios


#### Developement Notes
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

#### See Also
See the [current issues at github](https://github.com/jmdahle/news-forum/issues)
See the [Codesource at github](https://github.com/jmdahle/news-forum)
