var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ImageSchema = new Schema({
    musician: Schema.ObjectId,
    caption: String,
    url: {
      type: String
    }

});

module.exports = mongoose.model('Image', ImageSchema);
