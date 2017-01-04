var app = {
  handleUsernameClick: function() { return true; },

  server: 'https://api.parse.com/1/classes/messages'
  // handleSubmit: {
  //   calledOnce: function() {return true},

  // }

};

app.init = function() {
  $(document).ready(function(){
    $('.username').on('click', function() {
      return app.handleUsernameClick();
    });

    $('.submit').on('click', function() {
      app.handleSubmit();
      console.log('clicked');
    });

    app.fetch();
    var date = new Date();
    time = date.toISOString();
    
    // var date = new Date();
    window.setInterval(function () {
      date = new Date();
      time = date.toISOString();
    }, 1000);

    window.setInterval(app.fetch, 5000);
    window.setInterval(app.clearMessages, 5000);
  });
};

app.handleSubmit = function() {
  var inputMessage = document.getElementById('message').value;
  var object = {};
  object.roomname = 'default';
  object.username = location.search.slice(10);
  object.text = inputMessage;

  app.renderMessage(object);
  app.send(object);
};

app.send = function(message) {
  console.log('message: ', message)
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages', 
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function ( data ) {
      console.log('data sent: ', data)
      // console.log("this is the message, ", message)
      console.log('chatterbox: Message sent');
    },
    error: function (data) {


      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });

};

app.fetch = function (time) {
  console.log('time: ', time)

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    //createdAt < currentTime.
    //where currenTime is a variable being updated by setInterval every so often
    url: 'https://api.parse.com/1/classes/messages',
    //'?where={"createdAt":{"$lte":"2017-01-03T23:32:20.948Z"}}'
    //+ '?where={"createdAt":{"$lt":' + time + '}}',
    // + time,
    // + '?where={"createdAt":{"$gt":"2017-01-03T12:01:00.931Z"}}',
     // '?limit={"limit":{"1000"}}',

    type: 'GET',
    //"username":{"$gte":"Nick"},
    data: {order: '-createdAt'},
    // data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      console.log(data.results)
      data.results.forEach(function (element) {
        app.renderMessage(element);
      });

    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }

  });

};

app.clearMessages = function () {
  $('#chats').empty();
}; 

app.renderMessage = function(messageObject) {
  var user = messageObject.username;
  var text = messageObject.text;
  var room = messageObject.roomname;
  $('#chats').append('<p class="username">' + user + ': ' + text + '</p>');

};

app.renderRoom = function (roomName) {
  $('#roomSelect').append('<a>' + roomName + '</a>');
  console.log('testing renderRoom');
};

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("roomSelect").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// var value = document.getElementById('unique').value;
// console.log(value);

// $('body').on('click', function() {
//   alert('testing submit');
// });
app.init();


//link to fetch
// https://parseplatform.github.io/docs/rest/guide/#request-format
