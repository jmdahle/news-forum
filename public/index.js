let testLink = {
    link: 'https://www.angrymetalguy.com/category/reviews/'
}
$('#btn-scrape').on('click', e => {
    $.post({
        url:'/add/scrape',
        data: testLink
    })
        .then( (dbScrapeResult) => {
            console.log( dbScrapeResult );
            let $p = $('<p>');
            $p.text(JSON.stringify(dbScrapeResult));
            $('#scraper-wrapper').append( $p );
        });
});

let testArticle = {
    title: 'test title',
    link: 'https"//www.test.com/testlink'
}
// note that duplicates return an error on insert - titles must be unique is enforced by data model
// question: where to handle?  Prefer it is handled on back end; perhaps logged as a duplicate?
$('#testArticle').on('click', e => {
    $.post({
        url: '/add/Article',
        data: testArticle
    })
        .then( (dbArticle) => {
            let $p = $('<p>');
            $p.text(JSON.stringify(dbArticle));
            $('#articles-wrapper').append( $p );
        });
});

let testComment = {
    body: 'this is the comment body',
    commentor: 'John'
}
// note [not tested] that duplicates [do what] on insert - [is anything required to be unique?] and [is/is not] enforced by data model?
// [possible question: where to handle?  Prefer it is handled on back end; perhaps logged as a duplicate?]
$('#testComment').on('click', e => {
    $.post({
        url: '/add/Comment',
        data: testComment
    })
        .then( (dbComment) => {
            let $p = $('<p>');
            $p.text( JSON.stringify(dbComment));
            $('#comments-wrapper').append( $p );
        });
});