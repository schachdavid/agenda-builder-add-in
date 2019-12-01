import * as React from "react";
import * as styles from "./app.module.css";
import Agenda, { AgendaViewModel } from 'react-event-agenda'
import { initializeIcons } from '@uifabric/icons';

import moment = require("moment");


export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState { }

export default class App extends React.Component<AppProps, AppState> {
  agendaViewModel: AgendaViewModel;
  constructor(props, context) {
    super(props, context);
    this.agendaViewModel = new AgendaViewModel({
      "id": "f4159afc-ca9b-452b-9779-b2fb0289d5ac ",
      "days": [
        {
          "id": "49982ca2-95b7-4c5e-b0c2-bbe51465736e",
          "startTime": "2013-02-08T07:00:00.000Z",
          "endTime": "2013-02-08T16:30:00.000Z",
          "tracks": [
            {
              "id": "dba5df09-95b7-43aa-bae8-8d670a696417",
              "name": "",
              "items": [
                {
                  "id": "5331f2cf-4b0b-40fe-9d61-60221e3694f3",
                  "title": "Welcome",
                  "speaker": "Host Company",
                  "start": "2013-02-08T09:00:00.000Z",
                  "end": "2013-02-08T10:00:00.000Z"
                }
              ]
            }
          ]
        }
      ]
    });
    this.state = {
      listItems: []
    };
    initializeIcons();

  }

  click = async () => {
    Office.context.mailbox.item.body.getAsync(
      "html",
      { asyncContext: "This is passed to the callback" },
      function callback(result) {
        let el = document.createElement("html");
        el.innerHTML = result.value;
        el.querySelectorAll("body *").forEach(el => {
          el.setAttribute("style", "font-family: comic sans ms; color: aqua; background-color: red;");
        });

        console.log(el);

        Office.context.mailbox.item.body.setAsync(
          el.innerHTML,
          {
            coercionType: Office.CoercionType.Html,
            asyncContext: "This is passed to the callback"
          },
          function callback(result) {
            console.log(result);
          }
        );
      }
    );
  };




  render() {
    return (
      <>
        <button onClick={this.click}></button>
        <div style={{ height: '100vh', width: '100vw', maxWidth: '100%' }}>
          <Agenda
            agendaViewModel={this.agendaViewModel}
          />
        </div>
      </>
    );
  }
}
