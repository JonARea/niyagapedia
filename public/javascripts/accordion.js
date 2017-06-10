$(document).ready(function($) {
    $('#accordion').find('.accordion-toggle').click(function(){

      //Expand or collapse this panel
      $(this).next().slideToggle('fast');
      $(this).prev('span').toggleClass('glyphicon-triangle-right glyphicon-triangle-bottom')


    });
  });
