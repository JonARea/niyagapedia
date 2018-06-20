var should = require('should')
var mongoose = require('mongoose')
var Group = require('../models/group.js')
var Musician = require('../models/musician')
var db

describe('Group', function() {
    before(function(done) {
        db = mongoose.connect('mongodb://localhost/test-niyagapedia')
            done()
    })

    after(function(done) {
        mongoose.connection.close()
        done()
    })

    beforeEach(function(done) {
        var musician = new Musician({
            name: 'Pak Sular'
        })
        musician.save(function(error) {
          if (error) throw new Error(error)
        })
        var group1 = new Group({
            name: 'Kusuma Laras',
            summary: 'New York Gamelan group thats moderately awesome.',
            musicians: [musician.id]
        })
        group1.save(function(error) {
            if (error) throw new Error(error)
        })
        var group2 = new Group({
            name: 'Asari Raras',
            summary: 'Another Group from somewhere',
            musicians: [musician.id]
        })
        group2.save(function(error) {
            if (error) throw new Error(error)
            done()
        })
    })

    afterEach(function(done) {
        Group.remove({}, function() {
            Musician.remove({}, function() {
                done()
            })
        })
    })

    it('finds a group by groupname', function(done) {
        Group.findOne({ name: 'Kusuma Laras' }, function(err, group) {
            if (err) throw new Error(err)
            group.name.should.eql('Kusuma Laras')
            done()
        })
    })
    it('adds musicians to a group', function(done) {
      Group.findOne({ name: 'Kusuma Laras' })
        .populate('musicians')
        .exec(function(err, group) {
          if (err) throw new Error(err)
          group.musicians[0].name.should.eql('Pak Sular')
          group.musicians.length.should.eql(1)
          done()
      })
    })
    describe('group list method', function() {
      it('returns a list of groups in alphabetical order', function() {
        Group.find()
          .sort([['name', 'ascending']])
          .exec(function (err, list_groups) {
            if (err) throw new Error()
            list_groups.length.should.eql(2)
            list_groups[1].name.should.eql('Kusuma Laras')
          })
      })
    })
    describe('group create post method', function() {
      it('creates a new group', function() {
        var group = new Group({
            name: 'Ande ande Lumut',
            musicians: [],
            summary: 'New York Gamelan group thats moderately awesome.'
        })

      //Not checking if group already exists so we can have multiple groups with same name
      })
    })
  })
