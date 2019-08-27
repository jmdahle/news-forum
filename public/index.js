$(document).ready( () => {
    // document events
    $(document).on('click', '#testArticle', getArticleList );
    $(document).on('click', '#btn-scrape', submitScrapeRequest );
    $(document).on('click', '#btn-submit-comment', submitComment );
    $(document).on('click', '.btn-open-article-link', openArticle );
    $(document).on('click', '.btn-view-comments', viewComments );

    //Jquery References
    let $articles = $('#articles-content');
    let $comments = $('#comments-content');
    let $message = $('#message-area');

    // document global variables

    function submitScrapeRequest (e) {
        e.preventDefault();
        $
            .post({
            url:'/add/scrape'
        })
            .then( (dbScrapeResult) => {
                console.log( dbScrapeResult );
                let $p = $('<p>');
                $p.text(JSON.stringify(dbScrapeResult));
                $message.append( $p );
        });
    };
    

    // note [not tested] that duplicates [do what] on insert - [is anything required to be unique?] and [is/is not] enforced by data model?
    // [possible question: where to handle?  Prefer it is handled on back end; perhaps logged as a duplicate?]
    function submitComment (e) {
        e.preventDefault();
        let newBody = $('#new-comment-body').val().trim();
        let newCommentor = $('#new-comment-commentor').val().trim();
        let newArticleId = $(this).attr('data-id');
        let newComment = {
            body: newBody,
            commentor: newCommentor,
            article_id: newArticleId
        }
        console.log(newComment);
        $
            .post({
            url: '/add/Comment',
            data: newComment
        })
            .then( (dbComment) => {
                let $p = $('<p>');
                $p.text( JSON.stringify(dbComment));
                $comments.append( $p );
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
                listHtml += `<ul id='articleList' data-selected-item=''>`;
                listSource.forEach(element => {
                    listHtml += '<li>';
                    listHtml += `<div id='article-${element._id}' class='not-selected'>`
                    listHtml += `<h4>${element.title}</h4>`;
                    listHtml += `<div class='article-summary'>${element.summary}</div>`;
                    listHtml += `<button class='btn-open-article-link' data-href='${element.link}' data-traget='article-window'>OPEN ARTICLE</button>`;
                    listHtml += `<button class='btn-view-comments' data-article-id='${element._id}'>VIEW COMMENTS</a>`; 
                    listHtml += `</div>`;
                    listHtml += '</li>';
                });
                listHtml += '</ul>';
                listHtml += '</div>';
                listHtml = $(listHtml);
                $articles.append(listHtml);
                });
    }

    function openArticle(e) {
        alert ('Open article in new window');
    }

    function viewComments (e) {
        // update old selection
        let selectedArticleId = $('#articleList').attr('data-selected-item');
        $(`#article-${selectedArticleId}`).attr('class','not-selected');
        // update article-id
        let article_id = $(this).attr('data-article-id');
        // update new selection
        $('#articleList').attr('data-selected-item',article_id);
        $(`#article-${article_id}`).attr('class','selected');
        // update button data
        $('#btn-submit-comment').attr('data-id', article_id);
        // populate Comments for selected Article
        getCommentList(article_id);
    }

    function getCommentList(article_id) {
        $.get(`/comments/${article_id}`, dbComments => {
            $comments.empty();
            let listSource = dbComments;
            let listHtml = '';
            listHtml += '<div>';
            listHtml += '<ul>';
            listSource.forEach(element => {
                listHtml += '<li>';
                listHtml += `<div data-id='${element. _id}'>`;
                listHtml += `<p>${element.body}</p>`;
                listHtml += `<p>- posted by ${element.commentor}</p>`
                listHtml += `</div>`;
                listHtml += '</li>';
            });
            listHtml += '</ul>';
            listHtml += '</div>';
            listHtml = $(listHtml);
            $comments.append(listHtml);
            });
        
    }

});

