var mongoose = require('mongoose');

// reference to Schema constructor
var Schema = mongoose.Schema;

var ArticleSchema = new Schema( {
    title: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
    },
    comments: [{
        // a reference to Comment; Comment is a child of Article
        // each Article has 0 or more comments
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

var Article = mongoose.model('Article', ArticleSchema);

// Export the Article model
module.exports = Article;