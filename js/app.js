
// Use natural aspect ratio of map to set height and maintain
// proper marker size
var sizeMap = function() {
  var width = $('#index-map').width(),
      windowWidth = $(window).width(),
      windowHeight = $(window).height(),
      aspect = 0.5625,
      height = width * aspect,
      top = ((windowHeight / 2) - (height / 2));

  if (windowWidth > 699) {
    $('#index-map').css({
      'height': (height > windowHeight) ? windowHeight + 'px' : height + 'px',
      'width': (height > windowHeight) ? (windowHeight / aspect) + 'px' : '100%',
      'top': (top > 0) ? top + 'px' : 0,
      'left': (height > windowHeight) ? ((windowWidth - (windowHeight / aspect)) / 2) + 'px' : 0
    });

    // Fit the headline text
    $("#line1").fitText(0.57);
    $("#line2").fitText(0.38);
  } else {
    $('#index-map').css({
      'width': 'auto',
    });

    $("#index-nav h1").fitText();
  }
}

var requestFullScreen = function() {
  var element = document.body;

  // Supports most browsers and their versions.
  var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

  if (requestMethod) { // Native full screen.
    requestMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
    var wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}


var showModal = function(e) {
    $(e.currentTarget).css({
      'display': 'block'
    });
    var windowHeight = $(window).height(),
        windowWidth = $(window).width(),
        dialog = $(e.currentTarget).find('.modal-dialog');
        header = $(e.currentTarget).find('.modal-header')
        button = $(e.currentTarget).find('.conoce'),
        victims = $(e.currentTarget).find('.victims'),
        images = $(e.currentTarget).find('img'),
        elementHeight = header.outerHeight() + victims.outerHeight() + button.outerHeight() + dialog.offset().top + 280,
        maxHeight = windowHeight - elementHeight;

    if (windowWidth > windowHeight) {
      images.height(maxHeight);
    }
}

var shownModal = function(e) {
  $(e.currentTarget).find('img.lazy').each(function() {
    var src = $(this).data('original');
    $(this).attr('src', src);
  });

}

$(document).ready(function() {
  // Size map on init and resize
  sizeMap();
  $(window).on('resize', sizeMap);

  // Bind tooltips
  $('.marker-inner').tooltip();

  // Bind modal open before it animates into view
  $('.modal').on('show.bs.modal', showModal);

  // Bind modal when it is shown
  $('.modal').on('shown.bs.modal', shownModal);

  // Bind fullscreen button behavior
  $('#fullscreen i').on('click', requestFullScreen);
})

