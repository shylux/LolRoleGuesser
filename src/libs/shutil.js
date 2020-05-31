function fitOnOneLine(element) {
  const jqEl = $(element).css('font-size', '');
  const targetWidth = jqEl.width();
  const text = jqEl.text();
  let fontSize = parseInt(jqEl.css('font-size'), 10);

  const resizeEl = $('<span></span>').text(text).css({'font-size': fontSize, visibility: 'hidden'}).appendTo('body');
  while (resizeEl.width() > targetWidth) {
    resizeEl.css('font-size', --fontSize);
  }

  resizeEl.remove();
  jqEl.css('font-size', fontSize);
}
