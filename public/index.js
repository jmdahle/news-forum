$(document).ready( () => {
    // document events
    $(document).on('click', '#btn-get-article', populateArticleList );
    $(document).on('click', '#btn-scrape', submitScrapeRequest );
    $(document).on('click', '#btn-submit-comment', submitComment );
    $(document).on('click', '.btn-open-article-link', openArticle );
    $(document).on('click', '.btn-view-comments', viewComments );
    $(document).on('click', '#btn-close-comments', hideComments );

    //Jquery References
    let $articles = $('#articles-content');
    let $comments = $('#comments-wrapper');
    let $footer = $('#footer-area');
    let $header = $('#header-area');

    // comments begin hidden
    

    // popuate the article list 
    populateArticleList();

    function showWarning(warntext) {
        $('#form-warn').text(warntext);
    }

    function clearWarning() {
        $('#form-warn').text('');
    }

    function showComments() {
        $comments.modal('show');
    }

    function hideComments(e) {
        e.preventDefault
        $comments.modal('hide');
        clearWarning();
    }
    function submitScrapeRequest (e) {
        e.preventDefault();
        $
            .post({
            url:'/add/scrape'
        })
            .then( (dbScrapeResult) => {
                // console.log( dbScrapeResult );
                // let $p = $('<p>');
                // $p.text(JSON.stringify(dbScrapeResult));
                // $footer.append( $p );
                populateArticleList();
        });
    };
    

    // note [not tested] that duplicates [do what] on insert - [is anything required to be unique?] and [is/is not] enforced by data model?
    // [possible question: where to handle?  Prefer it is handled on back end; perhaps logged as a duplicate?]
    function submitComment (e) {
        e.preventDefault();
        let newBody = $('#new-comment-body').val().trim();
        let newCommentor = $('#new-comment-commentor').val().trim();
        let newArticleId = $(this).attr('data-id');
        if (newBody.length < 1 || newCommentor.length < 1) {
            showWarning('Must enter a comment and your name');
        } 
        else {
            clearWarning();
            let newComment = {
                body: newBody,
                commentor: newCommentor,
                article_id: newArticleId
            }
            // console.log(newComment);
            $
                .post({
                url: '/add/Comment',
                data: newComment
            })
                .then( (dbComment) => {
                    // let $p = $('<p>');
                    // $p.text( JSON.stringify(dbComment));
                    // $comments.append( $p );
                    populateArticleList()
                    $comments.modal('hide');
            });
        }
    };

    function populateArticleList() {
        $
            .get('/articles', dbArticles => {
                $articles.empty();
                let listSource = dbArticles;
                let listHtml = '';
                listHtml += '<div>';
                listHtml += `<div id='articleList' data-selected-item=''>`;
                listSource.forEach(element => {
                    let numComments = element.comments.length;
                    listHtml += `<div id="article-${element._id}" class="not-selected card mb-3">`// style="max-width: 540px;">`;
                    listHtml += '<div class="row">';
                    listHtml += '<div class="col-md-4">';
                    listHtml += `<img src="${element.image}" class="card-img article-art" alt="album image">`
                    listHtml += '</div>';
                    listHtml += '<div class="col-md-8">';
                    listHtml += '<div class="card-body">'
                    listHtml += `<h5 class="card-title">${element.title}</h5>`;
                    listHtml += `<p class="card-text">${element.summary}</p>`;
                    listHtml += `<p class="card-text">`;
                    listHtml += `<button class='btn-open-article-link' data-href='${element.link}'>OPEN ARTICLE</button>`;
                    listHtml += `<button class='btn-view-comments' data-article-id='${element._id}'>VIEW COMMENTS <span class="badge badge-dark">${numComments}</span></button>`; 
                    listHtml += `</p>`;
                    listHtml +='</div></div></div></div>';
                });
                listHtml += '</div>';
                listHtml += '</div>';
                listHtml = $(listHtml);
                $articles.append(listHtml);
                });
    }

    function openArticle(e) {
        let externalLink = $(this).attr('data-href');
        let targetWindow = 'article';
        window.open( externalLink, targetWindow);
    }

    function viewComments (e) {
        let article_id = $(this).attr('data-article-id');
        // updates page references to current/selected Article
        updateCurrentArticle(article_id);
        // populate the comment list
        populateCommentList(article_id);
        // show the comments
        showComments();
    }

    function updateCurrentArticle(newArticleId) {
        // update old selection
        let selectedArticleId = $('#articleList').attr('data-selected-item');
        $(`#article-${selectedArticleId}`).attr('class','not-selected');
        // update new selection
        $('#articleList').attr('data-selected-item',newArticleId);
        $(`#article-${newArticleId}`).attr('class','selected');
        // update button data
        $('#btn-submit-comment').attr('data-id', newArticleId);
        
    }

    function populateCommentList(article_id) {
        $.get(`/article/${article_id}`, dbArticle => {
            $comments.empty();
            let title = dbArticle[0].title;
            let listSource = dbArticle[0].comments;
            let listHtml = '';
            listHtml += `<div id='comments-content' class='modal-dialog' role='document'>`;
            listHtml += `<div class='modal-content'>`;
            listHtml += `<div class='modal-header'>`;
            listHtml += `<h5 class='modal-title comments-title'>${title}</h5>`;
            listHtml += `<button id='btn-close-comments' type='button'> <span aria-hidden='true'>&times;</span></button>`;
            listHtml += '</div>'; //modal-header
            listHtml += `<div class='modal-body'>`;
            listSource.forEach(element => {
                listHtml += `<p data-id='${element. _id}'>`;
                listHtml += `${element.body}`;
                listHtml += ` (posted by ${element.commentor})`
                listHtml += `</p>`;
            });
            listHtml += '</div>'; //modal-body
            listHtml += '<div class="modal-footer">'    
            listHtml += `<form id='new-comment'>`;
            listHtml += `<h6 class='comments-title'>New Comment on ${title}</h6>`;
            listHtml += `<p id='form-warn' class='warning'></p>`
            listHtml += `<div class='form-group'>`;
            listHtml += `<label for='new-comment-body'>Comment:</label>`;
            listHtml += `<textarea id='new-comment-body' class='form-control'></textarea>`;
            listHtml += '</div>';
            listHtml += `<div class='form-group'>`;
            listHtml += `<label for='new-comment-commentor'>Posted By:</label>`;
            listHtml += `<input type='text' id='new-comment-commentor' class='form-control'>`;
            listHtml += '</div>';
            listHtml += `<button id='btn-submit-comment' type='submit' data-id='${article_id}'>Post Comment</button>`;
            listHtml += `</form>`;
            listHtml += '</div>'; //modal-footer
            listHtml += `</div>`; //modal-content
            listHtml += `</div>`; //modal-dialog
            listHtml = $(listHtml);
            $comments.append(listHtml);
            });
        
    }

});

