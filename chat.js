$(document).on('click', '.panel-heading span.icon_minim', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).ready(function() {
  user = new URLSearchParams(window.location.search);
  user = user.get('user');
  if (user != 'a') {
    user = 'b'
  }
});
function sendchat(clear) {
  var param = "clear"
  var chat = ""
  if (clear == null) {
    chat = $('#btn-input')[0].value;
    param=`chatuser=${user}|${chat}`
  }
  $("#btn-input")[0].value = "";
  if (clear != null || (chat != null && chat.length > 0)) {
    $.ajax({
      url: 'https://chat-317313.el.r.appspot.com?q=' + btoa(param),
      success: function(data) {
        //
      },
      complete: function() {
        // schedule the next request *only* when the current one is complete:
        // setTimeout(fetchchat, 1000);
      }
    });
  }
  fetchchat();
}
$(document).on('click', '#btn-chat', function(e) {
  sendchat();
});
$(document).on('keypress', 'input', function(e) {
  var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
  if(key == 13) {
    sendchat();
  }
});
$(document).on('focus', '.panel-footer input.chat_input', function (e) {
    var $this = $(this);
    if ($('#minim_chat_window').hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideDown();
        $('#minim_chat_window').removeClass('panel-collapsed');
        $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('click', '#new_chat', function (e) {
    var size = $( ".chat-window:last-child" ).css("margin-left");
     size_total = parseInt(size) + 400;
    alert(size_total);
    var clone = $( "#chat_window_1" ).clone().appendTo( ".container" );
    clone.css("margin-left", size_total);
});
$(document).on('click', '.icon_close', function (e) {
    //$(this).parent().parent().parent().parent().remove();
    sendchat('clear');
    $( "#chat_window_1" ).remove();
});
function fetchchat() {
  if ($("#chat_window_1").length ==0 || !$(".msg_container_base").is(":visible")) {
    return;
  }
  var param='fetch'
  $.ajax({
    url: 'https://chat-317313.el.r.appspot.com?q=' + btoa(param),
    success: function(data) {
      $(".messages").remove();
      var chat = data['chat']
      for (let index in chat) {
        var text = ''
        if (user == chat[index].user) {
          text += '<div class="row msg_container base_sent"><div class="messages msg_sent"><p>'
        } else {
          text += '<div class="row msg_container base_receive"><div class="messages msg_receive"><p>'
        }
        text += chat[index].chat + "</div></div>"
        $(".msg_container_base").append(text);
      }
      $('.msg_container_base').scrollTop($('.msg_container_base')[0].scrollHeight);
    },
    complete: function() {
      // schedule the next request *only* when the current one is complete:
      // setTimeout(fetchchat, 10000);
    }
  });
}

// schedule the first invocation:
setInterval(fetchchat, 10000);
