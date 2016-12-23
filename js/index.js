$(document).ready(function() {
  var streamers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"];
  for (var i = 0; i < streamers.length; i++) {
    addStreamerDiv(streamers[i]);
  }
  
  // function to add a div for a streamer
  function addStreamerDiv(streamer) {
    var html = '<div class="row streamerRow all" id="' + streamer + '">' + 
        '<div class="col-xs-2 logoHolder"></div>' +
        '<div class="col-xs-8 info"></div>' + 
        '<div class="col-xs-2 text-right statusHolder"></div>' +
        '</div>'; 
    $('#streamers').append(html);
    callApi(streamer);
  };
  
  // make api call for a streamer
  function callApi(streamer) {
    $.ajax({
      url: 'https://wind-bow.gomix.me/twitch-api/streams/' + streamer,
      dataType: 'jsonp',
      success: function(result) {
        var game = '';
        var logo;
        var logoHtml = '<div class="logo"></div>';
        if (result.stream !== null) { // streamer is online
          logo = result.stream.channel.logo;
          game = result.stream.game;
          logoHtml = '<img src="' + logo + '" alt="Streamer Logo" class="logo">';
          $('#' + streamer).addClass('online');
          renderApiInfo(streamer, game, logoHtml);
        } else { // streamer is offline
          $('#' + streamer).addClass('offline');
          $.ajax({
            url: 'https://wind-bow.gomix.me/twitch-api/channels/' + streamer,
            dataType: 'jsonp',
            success: function(result) {
              logo = result.logo;
              if (logo) {
                logoHtml = '<img src="' + logo + '" alt="Streamer Logo" class="logo">';
              }
              renderApiInfo(streamer, game, logoHtml);
            }
          }); 
        }
        }
    });
  };
  
  // render the info from the api call
  function renderApiInfo(streamer, game, logoHtml) {
    var streamerLink = 'https://www.twitch.tv/' + streamer;
    var nameHtml = '<a href="' + streamerLink + '" target="_blank">' + streamer + '</a>';
    var gameHtml = '<p>' + game + '</p>';
    var statusHtml = '<i class="fa fa-' + (game === '' ? 'exclamation' : 'check') + '"></i>';
    $('#' + streamer + ' .logoHolder').append(logoHtml);
    $('#' + streamer + ' .info').append(nameHtml);
    $('#' + streamer + ' .info').append(gameHtml); 
    $('#' + streamer + ' .statusHolder').append(statusHtml);
  };

  // show the correct streamers (following click and key events)
  function showCorrectStreamers() {
    var search = $('input').val();
    var re = new RegExp('^' + search, 'i');
    var status = $('.notch').parent().attr('id');
    for (var i = 0; i < streamers.length; i++) {
      var $streamer = $('#' + streamers[i]);
      if ($streamer.hasClass(status)) {
        $streamer.show();
      }
      if (!re.test(streamers[i])) {
        $streamer.hide();
      }
    }
  }
  
  // handle navBtn clicks
  $('.navBtn').on('click', function() {
    // place the notch under the appropriate navBtn
    var containerWidth = Number($('.container').css("width").slice(0, -2));
    var colSize = Number($(this).parent().attr('class').slice(-1));
    var notchLeft = containerWidth * colSize / 24 - 10;
    $('.notch').remove();
    $(this).append('<b class="notch"></b>');
    $('.notch').css('left', notchLeft);
    
    // display the correct streamers
    $('.streamerRow').hide();
    showCorrectStreamers();
  });
  
  // handle enter event in search bar
  $('input').keydown(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
  
  // handle non-enter events in search bar
  $('input').keyup(showCorrectStreamers);
  
  $('a').mouseup(function() {
    $(this).blur();
  });
});