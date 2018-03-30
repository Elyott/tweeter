/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function(){

//toggles compose field
$( '#compose' ).click(function() {
  $('.new-tweet').slideToggle('slow', function() {
    $('#new_tweet_text').focus();
  });
});

//creates a new tweet
$('.new-tweet form').on('submit', function(event){
  event.preventDefault();
  if(checkCounter()){ //checks to make sure there is a message and it is less then max character limit
    addNewTweet(); //creates new tweet and loads it
    resetTextAndCounter(); //resets test field and counter
  }
});

//adds each tweet to the page
function renderTweets(tweetData){
  tweetData.forEach(function(tweet){
    let $tweet = createTweetElement(tweet);
    $('#tweets').append($tweet);
  });
}

function createTweetElement(tweet){
  //Creates new tweet article
  let $tweet = $('<article>').addClass('tweet');

  //Header
  let $header = $('<header>');
  let $userHandle = $('<p>').addClass('userHandle').append(tweet.user.handle);
  let $userImg = $('<img>').addClass('userPhoto').attr('src', tweet.user.avatars.small);
  let $userName = $('<h3>').append(tweet.user.name);
  $($header).append($userHandle).append($userImg).append($userName);
  $($tweet).append($header);

  // Tweet Text
  let $tweetTextContent = $('<p>').addClass('tweetText').text(tweet.content.text);
  $($tweet).append($tweetTextContent);

  //Footer
  let $footer = $('<footer>');
  let $flagbuttons = $('<i>').addClass('shareButtons').addClass('fas fa-flag');
  let $retweetbuttons = $('<i>').addClass('shareButtons').addClass('fas fa-retweet');
  let $heartbuttons = $('<i>').addClass('shareButtons').addClass('fas fa-heart');
  let $createdAt = $('<p>').append(timeSinceCreation(tweet.created_at));
  $($footer).append($heartbuttons).append($retweetbuttons).append($flagbuttons).append($createdAt);
  $($tweet).append($footer);

  return $tweet;
}

//calculates the time since the tweet was created and
// returns it in a specific format depending on amount of time passed
function timeSinceCreation(timeTweetWasCreated){
  let minutesSinceCreated = Math.round(((Date.now() - timeTweetWasCreated)/60000))
  let timeSince = '';
  if(minutesSinceCreated < 60){
    timeSince = `${minutesSinceCreated} minutes ago`;
  }else if(minutesSinceCreated < 120 ){
    timeSince = `${Math.round(minutesSinceCreated/60)} hour ago`;
  } else if(minutesSinceCreated < 3600){
    timeSince = `${Math.round(minutesSinceCreated/60)} hours ago`;
  } else {
    timeSince = `${Math.round(minutesSinceCreated/3600)} days ago`;
  }
  return timeSince
}

//loads all tweets
function loadTweets(){
  $.get('/tweets').done(function(tweets) {
    renderTweets(tweets.reverse());
  });
}

//creates a new text then loads it on the top of the list
function addNewTweet(){
  let text = $('#new_tweet_text').serialize();
  $.ajax({
    url: '/tweets',
    method: 'POST',
    data: text,
    complete: loadNewTweet()
  })
}

//loads newly created tweet to the top of the list
function loadNewTweet(){
  $.get('/tweets').done(function(tweets) {
    let latestTweet = tweets[(tweets.length - 1)];
    let $tweet = createTweetElement(latestTweet);
    $('#tweets').prepend($tweet);
  });
}

//checks to make sure there is a message and that it is less than or equal to 140 characters
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

//resets text field and counter
function resetTextAndCounter(){
  $('#new_tweet_text').val('');
  $('.counter').text(140);
}

loadTweets();

});