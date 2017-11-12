// $(document).ready(function($) {
//     $('#accordion').find('.accordion-toggle').click(function(){
//
//       //Expand or collapse this panel
//       $(this).next().slideToggle('fast') 
//       $(this).prev('span').toggleClass('glyphicon-triangle-right glyphicon-triangle-bottom')
//
//
//     }) 
//   }) 

function handleClick(e) {
  var actionID = e.target.classList.contains('addMusicians') ? 'addMusicians' : 'deleteMusicians'
  var arrow = document.getElementById(actionID + 'Arrow')
  var list = document.getElementById(actionID + 'List')
  arrow.classList.toggle('glyphicon-triangle-right')
  arrow.classList.toggle('glyphicon-triangle-bottom')
  list.classList.toggle('hidden')
}
