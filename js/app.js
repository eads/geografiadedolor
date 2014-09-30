
// Use natural aspect ratio of map to set height and maintain
// proper marker size
var sizeMap = function() {
  $(window).off('resize.fittext orientationchange.fittext');

  var width = $('#index-map').width(),
      windowWidth = $(window).width(),
      windowHeight = $(window).height(),
      aspect = 0.57,
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

    $("#line1").css('font-size', '1em');
    $("#line2").css('font-size', '1em');
    $("#project-title").fitText();
  }
}

var startAudio = function() {
  var soundtrack = document.getElementById('soundtrack');

  if (typeof soundtrack.loop == 'boolean') {
    soundtrack.loop = true;
  } else {
    soundtrack.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);
  }

  $('#mute').on('click', toggleAudio);
  soundtrack.play();
}

var toggleAudio = function() {
  var soundtrack = document.getElementById('soundtrack');
  if (soundtrack.paused) {
    soundtrack.volume = 0;
    soundtrack.play();
    $(soundtrack).animate({volume: 1}, 800);
    $('#mute .icon-volume-up').removeClass('active');
    $('#mute .icon-volume-off').addClass('active');
  } else {
    $('#mute .icon-volume-off').removeClass('active');
    $('#mute .icon-volume-up').addClass('active');
    $(soundtrack).animate({volume: 0}, 500, function() {
      soundtrack.pause();
    });
  }
}

var fullscreenOn = function() {
  $('#fullscreen .icon-resize-full').removeClass('active');
  $('#fullscreen .icon-resize-small').addClass('active');
}

var fullscreenOff = function() {
  $('#fullscreen .icon-resize-small').removeClass('active');
  $('#fullscreen .icon-resize-full').addClass('active');
}

var toggleFullscreen = function() {
  if (BigScreen.enabled) {
    BigScreen.toggle()
  }
}

var showModal = function(e) {
    $(e.currentTarget).css({
      'display': 'block'
    });
    var windowHeight = $(window).height(),
        windowWidth = $(window).width(),
        mapHeight = $('#index-map').height(),
        header = $(e.currentTarget).find('.modal-header')
        button = $(e.currentTarget).find('.conoce'),
        victims = $(e.currentTarget).find('.victims'),
        images = $(e.currentTarget).find('img'),
        fuzz = 82, // Padding + margin of modal
        elementHeight = windowHeight - header.outerHeight() - victims.outerHeight() - button.outerHeight() - fuzz;

    if (windowWidth > 699) {
      images.css({
        'height': elementHeight + 'px',
        'width': 'auto',
      });
    } else {
      images.css({
        'width': '100%',
        'height': 'auto',
      });
    }
}

var shownModal = function(e) {
  $(e.currentTarget).find('img.lazy').each(function() {
    var src = $(this).data('original');
    $(this).attr('src', src);
  });
}

var _rotateQuote = function(el) {
  var state = $(el).data('state');
  $('#marker-' + state).find('.marker-inner').tooltip('show');
}

var blockCarousel = false;

var slideQuote = function(e) {
  var isHovered = !!$('.marker-inner').filter(function() { return $(this).is(':hover'); }).length;
  if (!blockCarousel && !isHovered) {
    $('.marker-inner').tooltip('hide');
    setTimeout(function() {
      $('.marker-inner').parent().addClass('quote-rotator');
      _rotateQuote($(e.relatedTarget));
    }, 200);
  }
}

var markerHoverTimeout;
var hoverMarker = function(e) {
  $('.marker-inner').parent().removeClass('quote-rotator');
  $('.marker-inner')
    .not($(e.currentTarget))
    .tooltip('hide');
  blockCarousel = true;
  clearTimeout(markerHoverTimeout);
  markerHoverTimeout = setTimeout(function() { blockCarousel = false; }, 1000);
}

var initializeQuotes = function() {
  $('#quotes').animate({'opacity': 1}, 600);
  _rotateQuote($('#quotes').find('.carousel').find('.active'));
  $('#quotes').find('.carousel')
    .on('slide.bs.carousel', slideQuote)
}

var exitPage = function(e) {
  e.stopPropagation();
  var href = this.href;
  var soundtrack = document.getElementById('soundtrack');
  $('.modal.in').animate({opacity: 0}, 900);
  $('#index-map').animate({opacity: 0}, 900);
  $(soundtrack).animate({volume: 0}, 800, function() {
    window.location = href;
  });
  return false;
}

$(document).ready(function() {
  // Size map on init and resize
  sizeMap();
  $(window).on('resize', sizeMap);

  $('#index-map').animate({opacity: 1}, 1500);

  // Fire up quotes after a second
  if ($(window).width() > 699) {
    setTimeout(initializeQuotes, 1800);
    setTimeout(startAudio, 1800);
  }

  // Bind tooltips
  $('.marker-inner').tooltip();
  $('.nav-share, .nav-tool i').tooltip({
    delay: {show: 500, hide: 0},
    html: true,
  });

  // Initialize hover behavior
  $('.marker-inner').hover(hoverMarker);
  $('.marker-inner').parent().addClass('quote-rotator');

  // Bind modal open before it animates into view
  $('.modal').on('show.bs.modal', showModal);

  // Bind modal when it is shown
  $('.modal').on('shown.bs.modal', shownModal);

  // Bind fullscreen button behavior
  BigScreen.onexit = fullscreenOff;
  BigScreen.onenter = fullscreenOn;
  $('#fullscreen').on('click', toggleFullscreen);

  $('.conoce a').on('click', exitPage);

});

