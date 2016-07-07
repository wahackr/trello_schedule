var request = require('request');

module.exports = function(app_key, token) {

  function clone(options, callback) {
    var endpoint = "https://api.trello.com/1/boards?key="+app_key+"&token="+token;

    request({
      uri: endpoint,
      method: "POST",
      formData: options
    }, function(err, response, body) {
      callback(err, body);
    });
  }

  function getBoard(board_id, callback) {
    var endpoint = "https://api.trello.com/1/boards/"+board_id+"?lists=open&list_fields=name&fields=name,desc,url&key="+app_key+"&token="+token;

    request({
      uri: endpoint,
      method: "GET"
    }, function(err, response, body) {
      callback(err, body);
    });
  }

  function createCard(options, callback) {
    var endpoint = "https://api.trello.com/1/cards?key="+app_key+"&token="+token;
    request({
      uri: endpoint,
      method: "POST",
      formData: options
    }, function(err, response, body) {
      callback(err, body);
    });
  }

  return {
    clone: clone,
    getBoard: getBoard,
    createCard: createCard
  };
  
};
