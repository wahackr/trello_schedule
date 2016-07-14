import Trello from "node-trello";
import Rx from "@reactivex/rxjs";
import moment from "moment";

import Schedule from "./schedule.config";

//get your token here: https://trello.com/app-key Token link
const TRELLO_APIKEY = process.env.TRELLO_APIKEY || "";
const TRELLO_TOKEN = process.env.TRELLO_TOKEN || "";
const ORGANIZATION = process.env.ORGANIZATION || "";
const BOARD_AS_TEMPLATE = process.env.BOARD_AS_TEMPLATE || "Template Board";

const t = new Trello(TRELLO_APIKEY, TRELLO_TOKEN);
const tGetObservable = Rx.Observable.bindNodeCallback(function() {
  t.get(...arguments);
});
const tPostObservable = Rx.Observable.bindNodeCallback(function() {
  t.post(...arguments);
});

function main() {

  const today = moment();

  console.log("loading account...");

  const createBoard$ = tGetObservable("/1/members/me", {fields: "username", boards: "open", organizations: "all"})
    .map(({organizations, boards}) => {
      // check if organization exists
      const myOrg = organizations.filter(d => d.name === ORGANIZATION)[0];
      if (!myOrg) {
        throw new Error("your organization does not exists");
      }

      // check duplicated
      const TODAY_BOARD_NAME = `report_${today.format("YYYY-MM-DD")}`;
      const todayBoard = boards
        .filter(d =>
          d.name === TODAY_BOARD_NAME &&
          d.idOrganization === myOrg.id
        )[0];
      if (todayBoard) {
        throw new Error("today report board already exists");
      }

      // check if template board exists
      const myBoard = boards
        .filter(d =>
          d.name === BOARD_AS_TEMPLATE &&
          d.idOrganization === myOrg.id
        )[0];
      if (!myBoard) {
        throw new Error("template board does not exists");
      }

      // do clone
      console.log("clone template board...");
      return tPostObservable("/1/boards", {
        name: TODAY_BOARD_NAME,
        idOrganization: myOrg.id,
        idBoardSource: myBoard.id
      });
    })
    .mergeAll()
    .map(newBoard => {
      // get the new board detail
      return tGetObservable(`/1/boards/${newBoard.id}`, {
        lists: "open",
        list_fields: "name",
        fields: "name,url"
      });
    })
    .mergeAll()
    .multicast(new Rx.Subject());

  const addCards$ = createBoard$
    .map(newBoard => {
      console.log("creating cards...");
      const { lists } = newBoard;
      return Rx.Observable.from(lists)
        .filter(list => list.name === "Todo")
        .map(list => {
          // get today's report
          const { report } = Schedule.days
            .filter(day => +day.dayofweek === today.day())[0] || {};

          return Rx.Observable.from(report)
            .map(task => {
              return tPostObservable("/1/cards", {
                "name": task.account,
                "desc": task.schedule + "\r\n" + task.type + "\r\nAM: " + task.am + "\r\nRemarks: " + task.remarks + "\r\nLead Time: " + task.time,
                "due": today.format("YYYY-MM-DD 6:00"),
                "idList": list.id
              });
            })
            .mergeAll();
        })
        .mergeAll();
    })
    .mergeAll();

  const countCards$ = addCards$.count();

  const summary$ = Rx.Observable.combineLatest(
    createBoard$,
    countCards$,
    (newBoard, cardCount) => {
      return `${newBoard.name} is created. ${cardCount} cards added to Todo list.\r\n<br/>${newBoard.url}`;
    }
  );

  summary$.subscribe(
    (summary) => console.log(`send email: ${summary}`),
    (err) => console.error(err),
    () => console.log("Finish")
  );

  createBoard$.connect();
};

module.exports = main;
