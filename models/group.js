var mongoose = require('mongoose') 
mongoose.Promise = global.Promise 

var Schema = mongoose.Schema 

var GroupSchema = Schema({
  name: {
    type: String,
    required: true,
    max: 100
  },
  summary: {
    type: String,
    required: true,
  },
  musicians: [{

      type: Schema.ObjectId,
      ref: 'Musician'

  }]
}) 

GroupSchema
  .virtual('url')
  .get(function (){
    return '/catalog/group/' + this._id 
  }) 

  module.exports = mongoose.model('Group', GroupSchema) 
