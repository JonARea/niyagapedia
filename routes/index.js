var express = require('express')
var router = express.Router()
var passport = require('passport')
var Account = require('../models/account')
var fs = require('fs')

//handle photo upload with S3
var testS3 = require('../test/testupload')
var S3 = require('../S3')

//handle file upload
var multer = require('multer')
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })
var Image = require('../models/image')

//storage has moved from cloudinary to S3
// var cloudinary = require('cloudinary')
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// })

var musician_controller = require('../controllers/musicianController')
var Musician = require('../models/musician')

/* GET home page. */

router.get('/', function (req, res, next) {
    res.redirect('/catalog')
  })


router.get('/register', function(req, res) {
    res.render('register', {user: req.user })
})

router.post('/register', function(req, res, next) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          return res.render('register', { error : err.message })
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err)
                }
                res.redirect('/')
            })
        })
    })
})


router.get('/login', function(req, res) {
    res.render('login', { user : req.user })
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }))

router.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/')
})
//Test S3 connection
router.get('/upload/test', function(req,res,next) {
  testS3.test()
  res.sendStatus(200)
})

//Photo upload form
router.get('/upload', function(req, res, next) {
  Musician.find()
  .sort([['name', 'ascending']])
  .exec(function(err, list_musicians){
    if (err) {return next(err) }
    res.render('upload', {musicians: list_musicians, user: req.user })
  })
})
router.post('/upload', upload.single('photoToUpload'), function (req, res, next) {
  //I've moved the photo database from cloudinary to S3

  // cloudinary.uploader.upload(req.file.path, function(result){
  //   var image = new Image ({
  //     musician: req.body.musician,
  //     caption: req.body.caption,
  //     url: result.url
  //   })
  //   image.save(function(err){
  //     if (err) {return err }
  //     res.redirect('/catalog/musician/' + req.body.musician)
  //   })
  // })

  req.checkBody('musician', 'You must choose a musician').notEmpty()
  req.sanitize('caption').escape()
  req.sanitize('musician').escape()
  req.sanitize('caption').trim()
  var errors = req.validationErrors()
  if (errors) { //Rerender form with errors
    Musician.find()
    .sort([['name', 'ascending']])
    .exec(function(err, musicians){
      if (err) {return next(err) }
      res.render('upload', {errors: errors, musicians: musicians, user: req.user})
    })
  } else {
    S3.upload(req.file, req.body, function() {
      var image = new Image ({
          musician: req.body.musician,
          caption: req.body.caption,
          key: req.file.originalname
      })
      image.save(function(err) {
        if (err) throw new Error(err)
        else res.redirect('/catalog/musician/' + req.body.musician)
      })
    })
  }

})



module.exports = router
