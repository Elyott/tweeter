/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function(){

$( "#compose" ).click(function() {
  $(".new-tweet").slideToggle( "slow", function() {
    $('#new_tweet_text').focus();
  });
});

$('.new-tweet form').on('submit', function(event){
  event.preventDefault();
  if(checkCounter()){
    addNewTweet();
    resetTextAndCounter();
  }
});

function renderTweets(tweetData){
  tweetData.forEach(function(tweet){
    var $tweet = createTweetElement(tweet);
    $('#tweets').append($tweet);
  });
}

function createTweetElement(tweet){
  //Creates new tweet article
  var $tweet = $('<article>').addClass('tweet');

  //Header
  var $header = $('<header>');
  var $userHandle = $('<p>').addClass('userHandle').append(tweet.user.handle);
  var $userImg = $('<img>').addClass('userPhoto').attr('src', tweet.user.avatars.small);
  var $userName = $('<h3>').append(tweet.user.name);
  $($header).append($userHandle);
  $($header).append($userImg);
  $($header).append($userName);
  $($tweet).append($header);

  // Tweet Text
  var $tweetTextContent = $('<p>').addClass('tweetText').text(tweet.content.text);
  $($tweet).append($tweetTextContent);

  //Footer
  var $footer = $('<footer>');
  var $sharebuttons = $('<p>').addClass('shareButtons').text('buttons');
  var date = new Date(tweet.created_at);
  var $createdAt = $('<p>').append(date);
  $($footer).append($sharebuttons);
  $($footer).append($createdAt);
  $($tweet).append($footer);

  return $tweet;
}

function loadTweets(){
  $.get('/tweets').done(function(tweets) {
    renderTweets(tweets.reverse());
  });
}

function addNewTweet(){
  let text = $('#new_tweet_text').serialize();
  $.ajax({
    url: '/tweets',
    method: 'POST',
    data: text,
    complete: loadNewTweet()
  })
}

function loadNewTweet(){
  $.get('/tweets').done(function(tweets) {
    let latestTweet = tweets[(tweets.length - 1)];
    var $tweet = createTweetElement(latestTweet);
    $('#tweets').prepend($tweet);
  });
}

function checkCounter(){
  let counter = ($(event.target).children('#new_tweet_text').val()).length
  let warning = $('.container .warning');
  if(counter === 0){
    warning.text('Please Enter A Message!')
    warning.removeClass('opaque');
    setTimeout(function(){warning.addClass('opaque')}, 1400);
    return false;
  }else if(counter > 140){
    warning.text('You Are Too Verbose!')
    warning.removeClass('opaque');
    setTimeout(function(){warning.addClass('opaque')}, 1400);
    return false;
  }else{
    return true;
  }
}

function resetTextAndCounter(){
  $('#new_tweet_text').val('');
  $('.counter').text(140);
}

loadTweets();

});