var Chat = (function () {

  let users = []
  let messages = []
  let banned_words = ["university", "exams", "diet", "carbohydrates"]
  let module = {}
  // gives back users
  module.getUsers = function () {
    return users;
  }
  //searches to the full length of the messages and concatenates any matching results and return them
  module.search = function(query){
    var arrayLength = messages.length;
    var result = "";
    for (var i = 0; i < arrayLength; i++){
      if (messages[i].text.includes(query) | messages[i].author.includes(query)){
        result += messages[i].author + ": " + messages[i].text + "\n";
      }
    }
    return result;
  }
  //removes a user from the users array
  module.logout = function (user) {
    var index = users.indexOf(user);

    if (index > -1) {
      users.splice(index, 1);
    }
  }
  //check if the user already exists
  module.isUserUnique = function (user) {
    var arrayLength = users.length;
    for (var i = 0; i < arrayLength; i++){
      if (user == users[i]){
        return false;
      }
    }
    return true;
  }
  //let a new user join the chat
  module.joinChat = function (user) {
    users.push(user)
  }
  //let the user send a msg
  module.sendMsg = function (message) {
    messages.push(message)
    fetch('/api/messages', {
      method: 'post',
      credentials: 'include',
      body: JSON.stringify(message),
      headers: {
          'content-type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(data => {
      // Do something when the message was saved
      // Perhaps clear the input field or remove a loading indicator
})


  }
  //returns all the messages, returns the 10 latest messages
  module.getMessages = function () {

  fetch('/api/messages')
  .then(response => response.json())
  .then(data => {
    messages = data;
    alert(JSON.stringify(data));
    alert(messages);

      // Display the fetched messages in the browser
    })

    var max_messages = 10;
    if(messages.length > max_messages){
      var latest_messages = messages.slice(messages.length -max_messages, messages.length);
      return latest_messages;
    }else{return messages}
  }
  //censors words and replaces them with 4*
  module.getCensoredMessages = function () {
    var msgs_to_censor = Chat.getMessages();
    var arrayLength = msgs_to_censor.length;
    for (var m = 0; m < arrayLength; m++){
      for (var b = 0; b < banned_words.length; b++){
        msgs_to_censor[m].text = msgs_to_censor[m].text.replace(banned_words[b], "****")
        console.log(banned_words[b] + " " + msgs_to_censor[m].text);

      }
    }
    return msgs_to_censor;
  }

  return module
})()
