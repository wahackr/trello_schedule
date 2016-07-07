//get your token here: https://trello.com/app-key Token link
var app_key = process.env.TRELLO_APP_KEY || "";
var token = process.env.THELLO_TOKEN || "";

var trello = require("./trello.js")(app_key, token);
var dateFormat = require('dateformat');
var nodemailer = require('nodemailer');
var schedule = require("./schedule.config");
var template_board_id = '577b357e91f47f23b5e16dbc';
var email_to = [
  'wah.wong@abc.com'
]

function main() {

  var d = new Date();
  var w = d.getDay();
  schedule.days.forEach(function(day) {
    if (day.dayofweek == w) {
      createBoardOfTheDate(dateFormat(d, "yyyymmdd"), function(err, body){
        create_board_response = JSON.parse(body);
        board_id = create_board_response.id;
        board_name = create_board_response.name;
        console.log("[" + d + "] Created board " + board_name + " with ID: " + board_id);
        trello.getBoard(board_id, function(err, body) {
          get_board_response = JSON.parse(body);
          lists = get_board_response.lists;
          //console.log(lists);
          board_url = get_board_response.url;
          lists.forEach(function(list) {
            if (list.name == 'Todo') {
              var list_id = list.id;
              var cardno = 0;
              var promises = day.report.map(function(task) {
                return new Promise(function(resolve, reject) {
                  var options = {
                    "name": task.account,
                    "desc": task.schedule + "\r\n" + task.type + "\r\nAM: " + task.am + "\r\nRemarks: " + task.remarks + "\r\nLead Time: " + task.time,
                    "due":dateFormat(d, "yyyy-mm-dd") + " 6:00",
                    "idList":list_id
                  }
                  trello.createCard(options, function(err, body) {
                    if (err) {
                      return reject(body);
                    } else {
                      cardno++;
                      return resolve(body);
                    }
                  });
                });
              });
              Promise.all(promises).then(function(values) {
                console.log("Finish adding");
                sendEmail(email_to, 'Report Board created for ' + dateFormat(d, "yyyy-mm-dd"), cardno + " cards created to Todo list\r\n<br/>"+board_url);
              });
            }
          });
        });
      });
    }
  });
}

function createBoardOfTheDate(date, callback) {
  var options = {
    "name": 'report_'+date,
    "idOrganization":"opsteam12",
    "idBoardSource":template_board_id,
    "prefs_permissionLevel":"org"
  }
  trello.clone(options, callback);
}

function sendEmail(recipents, subject, body) {
  var transporter = nodemailer.createTransport('smtps://sys.notifications%40abc.com:1234@smtp.abc.com');
  var mailOptions = {
    from: 'sys.notifications@abc.com', // sender address
    to: recipents.join(','), // list of receivers
    subject: subject, // Subject line
    text: body, // plaintext body
    html: body // html body
  };
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
}

main();
