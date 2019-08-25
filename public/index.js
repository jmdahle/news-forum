$(document).ready( () => {
    // document events
    $(document).on('click', '#testArticle', getArticleList);
    $(document).on('click', '#btn-scrape', submitScrapeRequest)
    $(document).on('click', '#testComment', submitComment)

    //Jquery References
    let $articles = $('#articles-content');
    let $comments = $('#comments-content');
    let $scraper = $('#scraper-content');

    // document global variables

    let testLink = {
        link: 'https://www.angrymetalguy.com/category/reviews/'
    }
    function submitScrapeRequest (e) {
        e.preventDefault();
        $
            .post({
            url:'/add/scrape',
            data: testLink
        })
            .then( (dbScrapeResult) => {
                console.log( dbScrapeResult );
                let $p = $('<p>');
                $p.text(JSON.stringify(dbScrapeResult));
                $('#scraper-content').append( $p );
        });
    };
    
    let testComment = {
        body: 'this is the comment body',
        commentor: 'John'
    }

    // note [not tested] that duplicates [do what] on insert - [is anything required to be unique?] and [is/is not] enforced by data model?
    // [possible question: where to handle?  Prefer it is handled on back end; perhaps logged as a duplicate?]
    function submitComment (e) {
        e.preventDefault();
        $
            .post({
            url: '/add/Comment',
            data: testComment
        })
            .then( (dbComment) => {
                let $p = $('<p>');
                $p.text( JSON.stringify(dbComment));
                $('#comments-content').append( $p );
        });
    };

    function getArticleList(e) {
        e.preventDefault();
        $
            .get('/articles', dbArticles => {
                $articles.empty();
                let listSource = dbArticles;
                let listHtml = '';
                listHtml += '<div>';
                listHtml += '<ul>';
                listSource.forEach(element => {
                    listHtml += '<li>';
                    listHtml += `<div data-id='${element._id}'>`
                    listHtml += `<a href='${element.link}'>${element.title}</a>`;
                    listHtml += `<div class='article-summary'>${element.summary}</div>`;
                    listHtml += `</div>`;
                    listHtml += '</li>';
                });
                listHtml += '</ul>';
                listHtml += '</div>';
                listHtml = $(listHtml);
                $articles.append(listHtml);
                });
    }

});

