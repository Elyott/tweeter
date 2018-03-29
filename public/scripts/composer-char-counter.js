$(document).ready(function(){
  $('#new_tweet_text').on('keyup', function(){
    let numberOfCharacters = 140 - (($(event.target).val()).length);
    let counter = $(event.target).parent('form').children('.counter');
    if(numberOfCharacters < 0){
      counter.addClass('red');
    }else{
      counter.removeClass('red');
    }
    counter.text(numberOfCharacters);
  });
})