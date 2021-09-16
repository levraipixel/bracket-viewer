const DATA_KEY = 'data-bracket-url';

const fetchBracket = (bracketUrl, callback) => {
  // console.log('fetchBracket', bracketUrl);

  $.getJSON(bracketUrl, callback);
};

const renderMatch = (match) => {
  return $('<div>').html(
    match[0][0] + ' ' + match[0][1] + ' - ' + match[1][1] + ' ' + match[1][0]
  );
};

const renderBracket = (bracket) => {
  let $result = $('<div>');
  bracket.forEach((step, stepIdx) => {
    let $step = $('<div>');
    $step.append($('<h1>').html('--- STEP ' + stepIdx + ' ---'));
    step.forEach(match => {
      $step.append(renderMatch(match));
    });
    $result.append($step);
  });
  return $result;
};

const displayBracket = (el, bracket) => {
  // console.log('displayBracket', el, bracket);

  $(el).html(renderBracket(bracket));
};

const initElement = (el) => {
  // console.log('initElement', el);

  const $el = $(el);
  const url = $el.attr(DATA_KEY);
  $el.removeAttr(DATA_KEY);

  fetchBracket(url, (bracket) => {
    displayBracket(el, bracket);
  });
};

$(document).ready(() => {
  $('['+DATA_KEY+']').each(function() {
    initElement(this);
  });
});
