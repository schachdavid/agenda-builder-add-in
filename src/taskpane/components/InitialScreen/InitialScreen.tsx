import * as React from "react";
import * as styles from './InitialScreen.module.css';
import { Collapsible } from "./Collapsible/Collapsible";
const logo = require("../../../../assets/logo-filled.png")

import { CreateAgenda } from './CreateAgenda/CreateAgenda'
import { LoadAgenda } from "./LoadAgenda/LoadAgenda";





interface IProps {
    initializeAgenda: (startDate: Date, endDate: Date) => void,
    checkForData: () => void
}

export const InitialScreen: React.FC<IProps> = ({
     initializeAgenda,
     checkForData
}: IProps) => {





    return (
        <div className={styles.container} style={{}}>
            <div className={styles.headings}>
                <img src={logo} className={styles.logo}></img>
                <div>
                    <h1>Agenda</h1>
                    <h2>Builder</h2>
                </div>
            </div>
            <div className={styles.form}>
                <div className={styles.firstCollapsible}>
                <Collapsible item={
                    {
                        name: "Create New Agenda",
                        collapsed: true
                    }}>
                        <CreateAgenda initializeAgenda={initializeAgenda}/>
                    </Collapsible>
                </div>
               
                <Collapsible item={{ name: "Load Agenda", collapsed: false }}>
                    <LoadAgenda checkForData={checkForData}/>
                </Collapsible>
            </div>
        </div>
    )
};
