import * as React from "react";
import { initializeIcons } from '@uifabric/icons';
import { IAgendaJSON } from "react-event-agenda/dist/models/AgendaModel";
import { AddIn } from './AddIn/AddIn'
import { InitialScreen } from "./InitialScreen/InitialScreen";
import { Customizer } from 'office-ui-fabric-react';
import { createTheme } from 'office-ui-fabric-react';
import { palette } from "../colorPalette";


export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState { }

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: []
    };
    initializeIcons();
  }



  render() {
    if (!Office.context || !Office.context.mailbox || !Office.context.mailbox.item || !Office.context.mailbox.item.body) return null;

    return (
      <Customizer settings={{
        theme: createTheme({
          palette: palette,
          defaultFontStyle: { fontFamily: 'Open Sans'},
        })
      }}>
        <div style={{ width: '100%' }}>
          <AddIn></AddIn>
        </div>
      </Customizer>
    );
  }
}
