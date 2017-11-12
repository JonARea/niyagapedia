var AWS = require('aws-sdk')

var bucket = 'niyagapedia'

var s3 = new AWS.S3({
  params: {Bucket: bucket}
})

//To test connection to S3, send a GET request to /upload/test

exports.test = function () {
  var callback = function(err, data) {
   if (err) console.log(err, err.stack)
   else console.log(data)
  }
  s3.listObjects({}, callback)
}
