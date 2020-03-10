/* eslint-env browser */
/* eslint no-use-before-define: ["error", { "functions": false }] */
/* global $ */
const username = $.cookie('username');

const urlParams = new URLSearchParams(window.location.search);

$(() => {
  $('#login').submit(() => {
    $.cookie(
      'username',
      $('[name=username]')
        .val()
        .replace(/[^a-zA-Z0-9_-]/g, '')
    );
    window.location.href = '/home';
    return false;
  });

  $('#login .username').bind('keypress', function keypress(event) {
    const regex = new RegExp('^[a-zA-Z0-9]+$');
    const key = !event.charCode ? event.which : event.charCode;

    // Allow backspace and enter
    if (key === 8 || key === 13) return true;

    const char = String.fromCharCode(key);
    if (!regex.test(char) || $(this).val().length > 16) {
      event.preventDefault();
      return false;
    }

    return true;
  });

  $('#login .username').on('keyup', function keyup() {
    const text = $(this).val() || 'abc';
    const imgpath = `https://avatars.hoot.at/${text}.svg`;

    const img = new Image();
    img.onload = () => {
      $('.owl').css('background-image', `url(${imgpath})`);
    };
    img.src = imgpath;
  });

  if ($('#login').length) {
    $('#login .username').focus();
  }

  $('#post textarea').focus();

  $('#post textarea')
    .keyup(() => {
      const amt = 280 - $('#post textarea').val().length;
      $('#post .left').text(amt);
      $('#post .left').toggleClass('over', amt < 0);
      $('#post button').attr('disabled', amt < 0 || amt >= 280);
    })
    .trigger('keyup');

  $('#post').submit(() => {
    $.post(
      '/api/hoot',
      {
        post: $('#post textarea').val(),
        replyto: $('#post [name=replyto]').val(),
      },
      hoot => {
        const $h = addHoot(hoot);
        $('.hoots').prepend($h);
        $h.hide();
        $h.slideDown();
      }
    );

    $('input, textarea', $('#post')).val('');
    $('#post .left').text(280);

    const url = window.location.href.split('?')[0];
    window.history.pushState({}, $('title').text(), url);

    return false;
  });

  const $hoots = $('.hoots');
  if ($hoots.length) {
    let url = '/api/timeline';

    if ($hoots.data('username')) url = `/api/timeline/${$hoots.data('username')}`;
    if ($hoots.data('hoot')) url = `/api/hoot/${$hoots.data('hoot')}`;

    $.get(url, hoots => {
      $('.loader').remove();
      $('.empty').show();

      $(hoots).each((i, hoot) => {
        $('.hoots').append(addHoot(hoot));
      });
    });

    if (urlParams.get('replyto')) {
      $('#post textarea')
        .val(`@${urlParams.get('user')} `)[0]
        .focus();
      $('#post [name=replyto]').val(urlParams.get('replyto'));
    }
  }

  setInterval(() => {
    $('.timestamp').timeago();
  }, 10000);
});

function addHoot(hoot) {
  $('.empty').remove();
  const $post = $('<div>', {
    class: 'post',
  });

  const $avatar = $('<div>', { class: 'avatar' });
  $avatar.append($('<img>', { src: `https://avatars.hoot.at/${hoot.username}.svg` }));
  $post.append($avatar);

  const $body = $('<div>', {
    class: 'body',
  });

  const $byline = $('<div>', { class: 'byline' });

  $byline.append(
    $('<a>', {
      href: `/@${hoot.username}`,
      class: 'username',
      html: `<span>@</span>${hoot.username}`,
    })
  );
  if (hoot.replyto) {
    $byline.append(
      $('<a>', {
        href: `/hoot/${hoot.replyto._id}`,
        class: 'replying',
        html: `<i class="fa fa-reply"></i> replying to <span>@</span>${hoot.replyto.username}`,
      })
    );
  }

  $body.append($byline);
  const $postBody = $('<div>', { html: markdown(hoot.post) });
  $postBody.linkify();
  $body.append($postBody);
  const $actions = $('<div>', { class: 'actions' });
  $body.append($actions);

  const $timestampAnchor = $('<a>', {
    href: `/hoot/${hoot._id}`,
  });

  const $timestamp = $('<time>', {
    class: 'timestamp',
    datetime: hoot.createdAt,
    text: $.timeago(hoot.createdAt),
  });

  $timestampAnchor.append($timestamp);
  $actions.append($timestampAnchor);

  $actions.append($('<span>').html('&nbsp;&nbsp;&middot;&nbsp;&nbsp;'));

  const $favorite = $(username ? '<a>' : '<span>', {
    href: '',
    class: 'favorite',
    html: `favorite (<span>${hoot.favorites.length}</span>)`,
  });

  $favorite.prepend($('<i>', { class: 'fa fa-star' }));
  $favorite.prepend($('<i>', { class: 'fa fa-star-o' }));

  $actions.append($favorite);

  if (username) {
    $actions.append($('<span>').html('&nbsp;&nbsp;&middot;&nbsp;&nbsp;'));

    $favorite.toggleClass('favorited', hoot.favorites.indexOf(username) >= 0);
    $favorite.click(() => {
      $.post(`/api/hoot/${hoot._id}/favorite`, updatedHoot => {
        $favorite.find('span').text(updatedHoot.favorites.length);
        $favorite.toggleClass('favorited', updatedHoot.favorites.indexOf(username) >= 0);
      });
      return false;
    });

    const $reply = $('<a>', {
      href: `/home?replyto=${hoot._id}&user=${hoot.username}`,
      class: 'reply',
      html: '<i class="fa fa-reply"></i> reply',
    });
    $actions.append($reply);
  }

  $post.append($body);
  return $post;
}

function markdown(text) {
  const bold = /\*\*(.*?)\*\*/gm;
  const italic = /\*(.*?)\*/gm;
  const usernameRegex = /(@[a-zA-Z0-9-_]+)/gm;

  let processed = text || '';
  processed = text.replace(/</g, '&lt;');
  processed = text.replace(/>/g, '&gt;');
  processed = `<p>${text.split(/\n+/).join('</p><p>')}</p>`;
  processed = text.replace(bold, '<strong>$1</strong>');
  processed = text.replace(italic, '<em>$1</em>');
  processed = text.replace(usernameRegex, '<a href="/$1">$1</a>');
  return processed;
}
