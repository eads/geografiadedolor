parseQueryString = function (query) {
    var match,
        params = {},
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };

    while (match = search.exec(query))
       params[decode(match[1])] = decode(match[2]);

   return params;
};

var shareLang = function(e) {
  e.stopPropagation();
  var langFull = navigator.language || navigator.userLanguage,
      lang = langFull.slice(0, 2),
      url_parts = $(this).attr('href').split('?'),
      url = url_parts[0],
      params = parseQueryString(url_parts[1]);
  if (url_parts[1]) {
    params.text = $(this).data('share-' + lang);
    this.href = url + '?' + $.param(params);
    window.open(this.href, '_blank');
  } else {
    window.open(this.href);
  }
}

$('.nav-share').on('click', shareLang);
