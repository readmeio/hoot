$(function() {
  $('#login').submit(function() {
    $.cookie('whooter_username', $('[name=username]').val());
    window.location.href='/home';
    return false;
  });

  $('#post').submit(function() {
    $.post('/api/post', {
      'post': $('#post textarea').val(),
    }, function(post) {
      $('.content').prepend(addPost(post));
    });
    return false;
  });
});

function addPost(post) {
  var $post = $('<div>', {
    'class': 'post',
  });

  var $avatar = $('<div>', {'class': 'avatar'});
  $avatar.append($('<img>', {'src': 'https://api.adorable.io/avatar/70/'+post.username+'.png'}));
  $post.append($avatar);

  var $body = $('<div>', {
    'class': 'body',
  });

  $body.append($('<strong>', {text: '@' + post.username}));
  $body.append($('<p>', {text: post.post}));

  $post.append($body);
  return $post;
};
