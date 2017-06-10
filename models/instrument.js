var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var InstrumentSchema = Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 50
  },

});

InstrumentSchema
  .virtual('url')
  .get(function(){
    return '/catalog/instrument/' + this._id;
  });

  module.exports = mongoose.model('Instrument', InstrumentSchema);
