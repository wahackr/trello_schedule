var request = require('request');
module.exports = function(app_key, token) {

  var _app_key = app_key;
  var _token = token;
  var module = {};

  module.clone = function(options, callback) {
    var endpoint = "https://api.trello.com/1/boards?key="+_app_key+"&token="+_token;

    request({
      uri: endpoint,
      method: "POST",
      formData: options
    }, function(err, response, body) {
      if (err) {
        callback(err, body);
      } else {
        callback(err, body);
      }
    });
  };

  module.getBoard = function(board_id, callback) {
    var endpoint = "https://api.trello.com/1/boards/"+board_id+"?lists=open&list_fields=name&fields=name,desc,url&key="+_app_key+"&token="+_token;

    request({
      uri: endpoint,
      method: "GET"
    }, function(err, response, body) {
      if (err) {
        callback(err, body);
      } else {
        callback(err, body);
      }
    });
  };

  module.createCard = function(options, callback) {
    var endpoint = "https://api.trello.com/1/cards?key="+_app_key+"&token="+_token;
    request({
      uri: endpoint,
      method: "POST",
      formData: options
    }, function(err, response, body) {
      if (err) {
        callback(err, body);
      } else {
        callback(err, body);
      }
    });
  };

  return module;

};
