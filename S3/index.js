var AWS = require('aws-sdk')
var Bucket = process.env.S3_BUCKETNAME
var s3 = new AWS.S3({
  params: {Bucket}
})

exports.upload = function(file, requestBody, callback) {

    var params = {
      Body: file.buffer,
      Bucket,
      Key: 'photos/' + file.originalname,
      ContentType: file.mimetype
    }
    s3.putObject(params, function(err, data) {
      if (err) console.log(err, err.stack)

      else  callback()
    })
}

exports.getImage = function (key, callback) {
  var params = {
    Bucket,
    Key: 'photos/' + key
  }
  s3.getObject(params, function(err, data) {
    if (err) console.log(err, err.stack)
    else {
      var photoUrl = process.env.S3_URI + encodeURIComponent(key)
      callback(photoUrl)
    }
  })
}
