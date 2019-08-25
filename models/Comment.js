var mongoose = require('mongoose');

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new CommentSchema object
var CommentSchema = new Schema({
  body: {
    type: String
  },
  commentor: {
    type: String
  },
  article_id: {
    // reference to Article; Comment is a child of Article
    // not an array since a Comment is related to only one Article
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }
});

// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model('Comment', CommentSchema);

// Export the Comment model
module.exports = Comment;
