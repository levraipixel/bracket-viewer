const DATA_KEY = 'data-bracket-url';

const fetchBracket = (bracketUrl, callback) => {
  // console.log('fetchBracket', bracketUrl);

  $.getJSON(bracketUrl, callback);
};

const renderMatch = (match) => {
  let $result = $('<div>').addClass('match');
  match.forEach(player => {
    let $player = $('<div class="player">');
    $player.append($('<div class="name">').html(player[0]));
    $player.append($('<div class="score">').html(player[1]));
    $result.append($player);
  });
  return $result;
};

const renderBracket = (bracket) => {
  let $result = $('<div>').addClass('bracket');
  bracket.forEach((round, roundIdx) => {
    let $round = $('<div>').addClass('round');
    $round.append($('<h1>').html('Round ' + roundIdx));
    round.forEach(match => {
      $round.append(renderMatch(match));
    });
    $result.append($round);
  });
  $result.append(
    $('<div>').addClass('updated-at').html(
      'Last update: ' + (new Date()).toLocaleTimeString()
    )
  );
  return $result;
};

const displayBracket = (el, bracket) => {
  // console.log('displayBracket', el, bracket);

  $(el).html(renderBracket(bracket));
};

const updateBracket = (el, url) => {
  fetchBracket(url, (bracket) => {
    displayBracket(el, bracket);
  });
};

const initElement = (el) => {
  // console.log('initElement', el);

  const $el = $(el);
  const url = $el.attr(DATA_KEY);
  $el.removeAttr(DATA_KEY);

  const update = () => {
    updateBracket(el, url);
  };

  update();
  setInterval(update, 30 * 1000);
};

$(document).ready(() => {
  $('['+DATA_KEY+']').each(function() {
    initElement(this);
  });
});
