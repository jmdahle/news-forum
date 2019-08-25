// let testArticle = {
//     title: 'test title',
//     link: 'https"//www.test.com/testlink'
// }
// // note that duplicates return an error on insert - titles must be unique is enforced by data model
// // question: where to handle?  Prefer it is handled on back end; perhaps logged as a duplicate?
// $('#testArticle').on('click', e => {
//     $.post({
//         url: '/add/Article',
//         data: testArticle
//     })
//         .then( (dbArticle) => {
//             // let $p = $('<p>');
//             // $p.text(JSON.stringify(dbArticle));
//             let $p = articleCreateList(dbArticle);
//             $('#articles-wrapper').append( $p );
//         });
// });

getArticleList = () => {
    $.get('/articles', data => {
        console.log(data);
    })
}

articleCreateList = ( dbArticle , cb) => {
    let listSource = dbArticle;
    let listHtml = '';
    listHtml += '<div>';
    listHtml += '<ul>';
    listHtml += '<li>';
    listSource.forEach(element => {
        listHtml += `<div data-id='${element._id}'><a href='${element.link}'>${element.tite}</a></div>`;
    });
    listHtml += '</li>';
    listHtml += '</ul>';
    listHtml += '</div>';
    return listHtml;
}

