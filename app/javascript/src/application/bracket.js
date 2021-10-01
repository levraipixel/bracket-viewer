const DATA_KEY = 'data-bracket-url';

const fetchBracket = (bracketUrl, callback) => {
  // console.log('fetchBracket', bracketUrl);

  $.getJSON(bracketUrl, callback);
};

const renderMatch = (match, matchIdx, bracket, roundIdx) => {
  let $result = $('<div>').addClass('match');
  if(matchIdx < 1) {
    $result.addClass('first');
  }
  match.forEach((player, playerIdx) => {
    let $player = $('<div class="player">');
    let playerName = player[0];
    if(roundIdx > 0 && playerName) {
      let previousRound = bracket[roundIdx - 1];
      let $from = $('<div class="from">');

      if(playerIdx < 1) {
        if(matchIdx < 1) {
          let playerPreviousMatch = previousRound[matchIdx];
          console.log('previous match for', playerName, 'is', playerPreviousMatch);
          if(playerName == playerPreviousMatch[1][0]) {
            $player.addClass('from-lower');
          }
        } else {
          if(matchIdx > 0) {
            let playerPreviousMatch = previousRound[matchIdx - 1];
            if(playerName == playerPreviousMatch[0][0]) {
              $player.addClass('from-higher');
            }
          }
        }
      } else {
        if(matchIdx < (previousRound.length - 1)) {
          let playerPreviousMatch = previousRound[matchIdx + 1];
          if(playerName == playerPreviousMatch[1][0]) {
            $player.addClass('from-lower');
          }
        }
      }
      $player.append($from);
    }
    $player.append($('<div class="name">').html(playerName));
    $player.append($('<div class="score">').html(player[1]));
    if(match[playerIdx][1] > match[(1 + playerIdx) % 2][1]) {
      $player.addClass('winner');
    } else {
      if(match[playerIdx][1] < match[(1 + playerIdx) % 2][1]) {
        $player.addClass('loser');
      }
    }
    $result.append($player);
  });
  return $result;
};

const renderBracket = (bracket) => {
  let $result = $('<div>').addClass('bracket');
  bracket.forEach((round, roundIdx) => {
    let $round = $('<div>').addClass('round');
    $round.append($('<h3>').html('Tour ' + (1+roundIdx)));
    round.forEach((match, matchIdx) => {
      $round.append(renderMatch(match, matchIdx, bracket, roundIdx));
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
