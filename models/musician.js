'use strict'
var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var MusicianSchema = Schema({
  name: {
    type: String,
    required: true,
    max: 100
  },
  other_names: {
    type: String,
    max: 100
  },
  groups: [{
    type: Schema.ObjectId,
    ref: 'Group'
  }],
  instruments: [{
    type: Schema.ObjectId,
    ref: 'Instrument'
  }],
  biography: { type: String },
  anecdotes: { type: String },
  date_of_birth: {type: Date},
  date_of_death: {type: Date},
});

MusicianSchema
  .virtual('full_name')
  .get(function(){
    return this.name + ' ' + this.other_names;
  });

MusicianSchema
  .virtual('url')
  .get(function(){
    return '/catalog/musician/' + this._id;
  });

MusicianSchema
  .virtual('date_of_birth_formatted')
  .get(function(){
    return this.date_of_birth ? moment(this.date_of_birth).year() : '';
  });
MusicianSchema
  .virtual('date_of_death_formatted')
  .get(function(){
    return this.date_of_death ? moment(this.date_of_death).year() : '';
  });

module.exports = mongoose.model('Musician', MusicianSchema)
