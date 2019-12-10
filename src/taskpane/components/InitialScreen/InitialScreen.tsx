import * as React from "react";
import * as styles from './InitialScreen.module.css';
import { Collapsible } from "./Collapsible/Collapsible";
const logo = require("../../../../assets/logo-filled.png")

import { CreateAgenda } from './CreateAgenda/CreateAgenda'





interface IProps {
    initializeAgenda: (startDate: Date, endDate: Date) => void
}

export const InitialScreen: React.FC<IProps> = ({ initializeAgenda
}: IProps) => {




    const loadAgenda = <>
        <div className={styles.instructions}>
            The agenda data is saved together with the exported table inside the email. To load or duplicate an agenda:
            <ol>
                <li> Open the old email.</li>
                <li> Copy the whole agenda table including the info tags.</li>
                <li> Paste it into this email.</li>
                <li> Reload the add-in.</li>

            </ol>
        </div>
    </>



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
                    {loadAgenda}
                </Collapsible>

            </div>
        </div>
    )
};
