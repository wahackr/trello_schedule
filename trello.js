var request = require('superagent');

module.exports = function(app_key, token) {

  function clone(options) {
    var newOptions = Object.assign({}, options, {key: app_key, token: token});
    return request
      .post("https://api.trello.com/1/boards")
      .type("form")
      .send(newOptions)
      .then(function(res) { return res.body; });
  }

  function getBoard(board_id, callback) {
    request
      .get("https://api.trello.com/1/boards/"+board_id)
      .query({lists: "open", list_fields: "name", fields: "name,desc,url"})
      .query({key: app_key, token: token})
      .then(function(res) { return res.body; });
  }

  function createCard(options, callback) {
    var endpoint = "https://api.trello.com/1/cards?key="+app_key+"&token="+token;
    var newOptions = Object.assign({}, options, {key: app_key, token: token});
    request
      .post("https://api.trello.com/1/cards")
      .type("form")
      .send(newOptions)
      .then(function(res) { return res.body; });
  }

  return {
    clone: clone,
    getBoard: getBoard,
    createCard: createCard
  };

};
