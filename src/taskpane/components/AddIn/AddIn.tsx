import * as React from "react";
import { AgendaViewModel } from "react-event-agenda";
import * as styles from "./AddIn.module.css";
import { IAgendaJSON, Agenda } from "react-event-agenda/dist/models/AgendaModel";
import moment = require("react-event-agenda/node_modules/moment");
import { InitialScreen } from "../InitialScreen/InitialScreen";
import uuid = require("uuid");
import { IDayJSON } from "react-event-agenda/dist/models/DayModel";
import { AddInAgenda } from "../AddInAgenda/AddInAgenda";
import { replaceLast } from "../../util/stringUtil";
import { getAsyncMailBody } from "../../util/officeMailboxHelpers";
import { getTable } from "../../util/htmlGenerators";



interface IProps {

}

export const AddIn: React.FC<IProps> = ({
}: IProps) => {
    const [agendaViewModel, setAgendaViewModel] = React.useState(undefined);
    const [isReady, setIsReady] = React.useState(false);


    React.useEffect(() => {
        checkForData();
    }, [])

    const checkForData = async () => {
        const result = await getAsyncMailBody();
        const matches = /agendaData_start([\s\S]*)agendaData_end/.exec(result.value);
        if (matches && matches.length > 0) {
            let match = matches[0];
            match = match.replace(/(agendaData_end|agendaData_start)*/g, '');
            //replace quot
            match = match.replace(/&quot;/g, '"');
            //remove line breaks
            match = match.replace(/\r?\n|\r/g, ' ');
            const initialData = JSON.parse(match);
            const viewModel = new AgendaViewModel(initialData, handleDataChange);
            setAgendaViewModel(viewModel);
        }
        setIsReady(true);
    }



    const handleDataChange = async (data: IAgendaJSON) => {
        const result = await getAsyncMailBody();
        let newItemBody = result.value;
        const newDataString = 'agendaData_start' + JSON.stringify(data) + 'agendaData_end';
        newItemBody = newItemBody.replace(/agendaData_start([\s\S]*)agendaData_end/, newDataString)

        //create new tables
        const tables = data.days.map(day => getTable(day, result.value))

        //replace old
        var el = document.createElement('html');
        el.innerHTML = newItemBody;
        const tableElements = el.querySelectorAll('table');
        tableElements.forEach(tableElement => {
            if (tableElement.innerHTML.includes('Topic') && tableElement.innerHTML.includes('Speaker')) {
                let tmpEl = document.createElement('div');
                let renderedTable = tables.shift();
                tmpEl.innerHTML = renderedTable;
                if (renderedTable) {
                    tableElement.parentElement.replaceChild(tmpEl.children[0], tableElement);
                } //delete tables of non existing days
                else tableElement.parentElement.removeChild(tableElement);
            }
        })

        // case new days were added, add tables
        if (tables.length > 0) {
            while (tables.length > 0) {
                //get last agenda table
                const tableElements = el.querySelectorAll('table');
                let lastTable: HTMLTableElement;
                for (let i = tableElements.length - 1; i >= 0; i--) {
                    const tableElement = tableElements[i];
                    if (tableElement.innerHTML.includes('Topic') && tableElement.innerHTML.includes('Speaker')) {
                        lastTable = tableElement;
                        break;
                    }
                }
                if (lastTable) {
                    lastTable.insertAdjacentHTML('afterend', tables.shift());
                }
            }
        }

        //remove added line break
        el.innerHTML = replaceLast('<p class="MsoNormal">&nbsp;</p>', '', el.innerHTML);
        Office.context.mailbox.item.body.setAsync(
            el.innerHTML,
            {
                coercionType: Office.CoercionType.Html,
                asyncContext: "This is passed to the callback"
            }
        );
    };

    const initializeAgenda = (startDate: Date, endDate: Date) => {
        const data: IAgendaJSON = {
            id: uuid(),
            days: []
        }

        const days = data.days;
        const start = moment(startDate).set('hours', 0).set('minutes', 1);
        const end = moment(endDate).set('hours', 0).set('minutes', 1);

        if (!end.isSameOrAfter(start)) throw new Error('startDate should be Before or equal endDate');

        const numberOfDays = end.diff(start, 'days', true) + 1;
        let currentDay = moment(start);
        for (let i = 0; i < numberOfDays; i++) {
            const dayStartTime = moment(currentDay).set('hours', 8).set('minutes', 0);
            const dayEndTime = moment(currentDay).set('hours', 19).set('minutes', 0);
            days.push({
                id: uuid(),
                startTime: dayStartTime.toString(),
                endTime: dayEndTime.toString(),
                tracks: [{
                    id: uuid(),
                    name: "",
                    items: [
                        {
                            id: uuid(),
                            start: dayStartTime.toString(),
                            end: moment(dayStartTime).add('minutes', 30).toString(),
                            title: "Sample Topic",
                            speaker: "Sample Speaker",
                        }
                    ]
                }
                ]
            });
            currentDay.add('day', 1);
        }

        setAgendaViewModel(new AgendaViewModel({
            id: uuid(),
            days: days
        }, handleDataChange));

        let agendaEmailBody = '';
        if (days.length > 0) agendaEmailBody = agendaEmailBody + getTable(days[0]);
        for (let i = 1; i < days.length; i++) {
            agendaEmailBody = ` ${agendaEmailBody} 
            <br/>
            ${getTable(days[i])}`;
        }
        agendaEmailBody =
            // <span lang=EN-US style='font-size:11.0pt;color:#b8b8b8'>
            // 👋 Hi there, you just created an agenda<br>
            // The changes you are making using the Agenda Builder are reflected in the table below immediately and will be auto saved into this email.<br>
            // Do not try to edit the table's content directly.<br>
            // However you can style and format the table and its content to your liking.<br>
            // </span>
            `
        <span lang=EN-US style='font-size:8.0pt;color:#b8b8b8'>***do not delete or edit after this line***</span><span lang=EN-US> </span>
        <span style='display:none; font-size: 1pt; color: white;'>agendaData_start ${JSON.stringify(data)} agendaData_end</span>
        ${agendaEmailBody}
        <span lang=EN-US style='font-size:8.0pt;color:#b8b8b8'>***do not delete or edit before this line – this agenda has been built with the Agenda Builder Outlook Add-In***</span>`

        Office.context.mailbox.item.body.setSelectedDataAsync(
            agendaEmailBody,
            {
                coercionType: Office.CoercionType.Html,
            }
        );
    }

    return (
        <>
            {!isReady ? null :
                agendaViewModel !== undefined ?
                    <AddInAgenda agendaViewModel={agendaViewModel}></AddInAgenda> :
                    <InitialScreen initializeAgenda={initializeAgenda} checkForData={checkForData}></InitialScreen>
            }
        </>
    )
};

