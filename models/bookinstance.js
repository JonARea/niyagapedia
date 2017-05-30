var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var BookInstanceSchema = Schema({
  book: {
    type: Schema.ObjectId,
    ref: 'Book',
    required: true,
  },
  status: {
    type: String,
    enum: ['Available', 'Maintenence', 'Loaned', 'Reserved'],
    default: 'Maintenence',
    required: true,
  },
  imprint: {
    type: String,
    required: true,
  },
  due_back: {
    type: Date,
    default: Date.now,
  }
});

BookInstanceSchema
  .virtual('url')
  .get(function(){
    return '/catalog/bookinstance/' + this._id
  });
BookInstanceSchema
  .virtual('due_back_formatted')
  .get(function(){
    return moment(this.due_back).format('MMMM Do, YYYY')
  });

module.exports = mongoose.model('BookInstance', BookInstanceSchema);
