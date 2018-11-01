var username = $.cookie('whooter_username');

var urlParams = new URLSearchParams(window.location.search);

$(function() {
  $('#login').submit(function() {
    $.cookie('whooter_username', $('[name=username]').val().replace(/[^a-zA-Z0-9_-]/g, ''));
    window.location.href='/home';
    return false;
  });

  $('#login .username').bind('keypress', function (event) {
      var regex = new RegExp("^[a-zA-Z0-9]+$");
      var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
      if (!regex.test(key) || $(this).val().length > 16) {
         event.preventDefault();
         return false;
      }
  });
  $('#login .username').on('keyup', function (event) {
    var text = $(this).val() || 'abc';
    var imgpath = 'https://avatars.hootr.co/'+text+'.svg';

    var img = new Image();
    img.onload = function() {
      $('.owl').css('background-image', 'url('+imgpath+')');
    };
    img.src = imgpath;

  });

  if($('#login').length) {
    $('#login .username').focus();
  }

  $('#post textarea').focus();

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
      var $h = addHoot(hoot);
      $('.hoots').prepend($h);
      $h.hide();
      $h.slideDown();
    });

    $('input, textarea', $('#post')).val("");
    $('#post .left').text(140);

    var url = window.location.href.split('?')[0];
    history.pushState({}, $('title').text(), url);

    return false;
  });

  var $hoots = $('.hoots');
  if($hoots.length) {

    var url = '/api/timeline';

    if($hoots.data('username')) url = '/api/timeline/' + $hoots.data('username');
    if($hoots.data('hoot')) url = '/api/hoot/' + $hoots.data('hoot');

    $.get(url, function(hoots) {
      $('.loader').remove();
      $('.empty').show();

      $(hoots).each(function(i, hoot) {
        $('.hoots').append(addHoot(hoot));
      });
    });

    if(urlParams.get('replyto')) {
      $('#post textarea').val('@' + urlParams.get('user') + ' ')[0].focus();
      $('#post [name=replyto]').val(urlParams.get('replyto'));
    }
  }

  setInterval(function() {
    $(".timestamp").timeago();
  }, 10000);
});

function addHoot(hoot) {
  $('.empty').remove();
  var $post = $('<div>', {
    'class': 'post',
  });

  var $avatar = $('<div>', {'class': 'avatar'});
  $avatar.append($('<img>', {'src': 'https://avatars.hootr.co/'+hoot.username+'.svg'}));
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
  var $postBody = $('<div>', {html: markdown(hoot.post)});
  $postBody.linkify();
  $body.append($postBody);
  var $actions = $('<div>', {'class': 'actions'});
  $body.append($actions);

  var $timestamp_a = $('<a>', {
    'href': '/hoot/' + hoot._id
  });

  var $timestamp = $('<time>', {
    class: 'timestamp',
    datetime: hoot.createdAt,
    text: $.timeago(hoot.createdAt),
  });

  $timestamp_a.append($timestamp);
  $actions.append($timestamp_a);


  $actions.append($('<span>').html('&nbsp;&nbsp;&middot;&nbsp;&nbsp;'));

  var $favorite = $(username ? '<a>' : '<span>', {
    href: '',
    'class': 'favorite',
    html: 'favorite (<span>' + hoot.favorites.length + '</span>)',
  });

  $favorite.prepend($('<i>', {'class': 'fa fa-star'}));
  $favorite.prepend($('<i>', {'class': 'fa fa-star-o'}));

  $actions.append($favorite);

  if(username) {
    $actions.append($('<span>').html('&nbsp;&nbsp;&middot;&nbsp;&nbsp;'));

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

    var $reply = $('<a>', {
      href: '/home?replyto=' + hoot._id + '&user=' + hoot.username,
      'class': 'reply',
      html: '<i class="fa fa-reply"></i> reply',
    });
    $actions.append($reply);

  }

  $post.append($body);
  return $post;
};

function markdown(text) {
  var bold = /\*\*(\S(.*?\S)?)\*\*/gm;
  var italic = /\*(\S(.*?\S)?)\*/gm;
  var username = /(@[a-zA-Z0-9-_]+)/gm;
  text = text || '';
  text = text.replace(/</g, '&lt;');
  text = text.replace(/>/g, '&gt;');
  text = "<p>" + (text.split(/\n+/).join('</p><p>')) + "</p>";
  text = text.replace(bold, '<strong>$1</strong>');
  text = text.replace(italic, '<em>$1</em>');
  text = text.replace(username, '<a href="/$1">$1</a>');
  return text;
};
