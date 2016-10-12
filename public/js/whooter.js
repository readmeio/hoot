var username = $.cookie('whooter_username');

var urlParams = new URLSearchParams(window.location.search);

$(function() {
  $('#login').submit(function() {
    $.cookie('whooter_username', $('[name=username]').val().replace(/[^a-zA-Z0-9_-]/g, ''));
    window.location.href='/home';
    return false;
  });

  $('#post textarea').keyup(function() {
    var amt = 140 - $('#post textarea').val().length;
    $('#post .left').text(amt);
    $('#post .left').toggleClass('over', amt < 0);
    $('#post button').attr('disabled', amt < 0 || amt >= 140);
  }).trigger('keyup');

  $('#post').submit(function() {
    $.post('/api/hoot', {
      'post': $('#post textarea').val(),
      'replyto': $('#post [name=replyto]').val(),
    }, function(hoot) {
      $('.hoots').prepend(addHoot(hoot));
    });
    return false;
  });

  var $hoots = $('.hoots');
  if($hoots.length) {
    var user = '';
    if($hoots.data('username')) user = '/' + $hoots.data('username');
    $.get('/api/timeline' + user, function(data) {
      $('.loader').remove();
      $('.empty').show();

      $.each(data, function(i, hoot) {
        $('.hoots').append(addHoot(hoot));
      });
    });

    if(urlParams.get('replyto')) {
      $('#post textarea').val('@' + urlParams.get('user') + ' ')[0].focus();
      $('#post [name=replyto]').val(urlParams.get('replyto'));
    }
  }
});

function addHoot(hoot) {
  $('.empty').remove();
  var $post = $('<div>', {
    'class': 'post',
  });

  var $avatar = $('<div>', {'class': 'avatar'});
  $avatar.append($('<img>', {'src': 'https://api.adorable.io/avatar/70/'+hoot.username+'.png'}));
  $post.append($avatar);

  var $body = $('<div>', {
    'class': 'body',
  });

  var $byline = $('<div>', { class: 'byline' });

  $byline.append($('<a>', {href: '/@' + hoot.username, 'class': 'username', html: '<span>@</span>' + hoot.username}));
  if(hoot.replyto) {
    $byline.append($('<a>', {href: '/hoot/' + hoot.replyto._id, 'class': 'replying', html: '<i class="fa fa-reply"></i> replying to <span>@</span>' + hoot.replyto.username}));
  }

  $body.append($byline);

  $body.append($('<div>', {html: markdown(hoot.post)}));
  var $actions = $('<div>', {'class': 'actions'});
  $body.append($actions);

  var $favorite = $('<a>', {
    href: '',
    'class': 'favorite',
    html: 'favorite (<span>' + hoot.favorites.length + '</span>)',
  });

  $favorite.prepend($('<i>', {'class': 'fa fa-star'}));
  $favorite.prepend($('<i>', {'class': 'fa fa-star-o'}));

  $actions.append($favorite);

  $actions.append($('<span>').html('&nbsp;&nbsp;&middot;&nbsp;&nbsp;'));

  var $reply = $('<a>', {
    href: '/home?replyto=' + hoot._id + '&user=' + hoot.username,
    'class': 'reply',
    html: '<i class="fa fa-reply"></i> reply',
  });
  $actions.append($reply);

  $favorite.toggleClass('favorited', hoot.favorites.indexOf(username) >= 0);
  $favorite.click(function() {
    $.post('/api/hoot/'+hoot._id+'/favorite', {
      favorited: !$favorite.hasClass('favorited'),
    }, function(hoot) {
      $favorite.find('span').text(hoot.favorites.length);
      $favorite.toggleClass('favorited', hoot.favorites.indexOf(username) >= 0);
    });
    return false;
  });

  $post.append($body);
  return $post;
};

function markdown(text) {
  var bold = /\*\*(\S(.*?\S)?)\*\*/gm;
  var italic = /\*(\S(.*?\S)?)\*/gm;
  var link = /(https?:\/\/[^\s]+)/gm;
  var username = /(@[a-zA-Z0-9-_]+)/gm;
  text = text.replace(/</g, '&lt;');
  text = text.replace(/>/g, '&gt;');
  text = "<p>" + (text.split(/\n+/).join('</p><p>')) + "</p>";
  text = text.replace(bold, '<strong>$1</strong>');            
  text = text.replace(italic, '<em>$1</em>');            
  text = text.replace(link, '<a href="$1">$1</a>');            
  text = text.replace(username, '<a href="/@$1">$1</a>');            
  return text;
};
