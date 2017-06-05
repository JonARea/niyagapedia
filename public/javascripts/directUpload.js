
//
// $(function() {
//   $('.sidebar-nav').append('<p>JQUERY</p>');
//   $.cloudinary.config({ cloud_name: 'niyagaphoto', api_key: '183951452293572'})
//   if($.fn.cloudinary_fileupload !== undefined) {
//     $("input.cloudinary-fileupload[type=file]").cloudinary_fileupload();
//   }
//   $('.cloudinary-fileupload').append($.cloudinary.unsigned_upload_tag('ehbfz0ig'));
//   var cloudinary_cors = "http://" + request.headers.host + "../cloudinary_cors.html";
//
// });

var cloud_name = 'niyagaphoto';
var preset_name = 'gambirsawit';

$(function(){
  $('.sidebar-nav').append('<p>JQUERY</p>')
  $.cloudinary.config({
    cloud_name: cloud_name
  })

  $('.upload_form').append(
      // First the "upload preset string", then your cloud name
      $.cloudinary.unsigned_upload_tag('gambirsawit')
  );
  $('.upload_field').unsigned_cloudinary_upload('gambirsawit',
  { cloud_name: 'niyagaphoto', tags: 'browser_uploads' },
  { multiple: true }
).bind('cloudinarydone', function(e, data) {

      $('.thumbnails').append($.cloudinary.image(data.result.public_id, {
        format: 'jpg',
        width: 150,
        height: 100,
        crop: 'thumb',
        gravity: 'face',
        effect: 'sharpen:300'
      }))
    }

  ).bind('cloudinaryprogress', function(e, data) {
  	var percent = Math.round((data.loaded * 100.0) / data.total);
    $('.progress_bar').css('width', percent + '%');
    $('.progress_wrapper .text').text(percent + '%');
  });



})
