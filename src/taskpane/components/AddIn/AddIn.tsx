import * as React from "react";
import { AgendaViewModel } from 'react-event-agenda'
import * as styles from './AddIn.module.css';
import { IAgendaJSON, Agenda } from 'react-event-agenda/dist/models/AgendaModel';
import moment = require("react-event-agenda/node_modules/moment");
import { InitialScreen } from "../InitialScreen/InitialScreen";
import uuid = require("uuid");
import { IDayJSON } from "react-event-agenda/dist/models/DayModel";
import { AddInAgenda } from "../AddInAgenda/AddInAgenda";
import { replaceLast } from "../../../util"






interface IProps {

}

export const AddIn: React.FC<IProps> = ({
}: IProps) => {
    const [isReady, setIsReady] = React.useState(false);
    const [agendaViewModel, setAgendaViewModel] = React.useState(undefined);

    React.useEffect(() => {
        Office.context.mailbox.item.body.getAsync(
            "html",
            function callback(result) {
                const matches = /agendaData_start([\s\S]*)agendaData_end/.exec(result.value);
                if (matches && matches.length > 0) {
                    let match = matches[0];
                    match = match.replace(/(agendaData_end|agendaData_start)*/g, '');
                    //replace quot
                    match = match.replace(/&quot;/g, '"');
                    //remove line breaks
                    match = match.replace(/\r?\n|\r/g, ' ');
                    console.log(match);
                    setAgendaViewModel(new AgendaViewModel(JSON.parse(match), handleDataChange));
                }
                setIsReady(true);
            }
        );
    }, [])


    const getTable = (day: IDayJSON, oldBody?: string) => {
        let table = '';
        //     const thOpeningTagMatches = newItemBody.match(/<th([\s\S]*?)>/)
        //     const thOpeningTag = thOpeningTagMatches ? thOpeningTagMatches[0] : '<th>'
        //     table = `<tr>
        //     ${thOpeningTag} Time</th>
        //     ${thOpeningTag} Topic</th>
        //     ${thOpeningTag} Speaker</th>
        //   </tr>`;
        const tdOpeningTagMatches = oldBody ? oldBody.match(/<td([\s\S]*?)>/) : undefined;
        const tdOpeningTagTime = tdOpeningTagMatches && tdOpeningTagMatches.length > 0 && false ? tdOpeningTagMatches[0] : `<td width=160 valign=top style='width:120pt;border:none;border-bottom:solid #C9C9C9 1.0pt; padding:0cm 5.4pt 0cm 5.4pt;height:10.05pt'>`;
        const tdOpeningTagTitle = tdOpeningTagMatches && tdOpeningTagMatches.length > 1 && false ? tdOpeningTagMatches[1] : `<td width=268 valign=top style='width:200pt;border:none;border-bottom:solid #C9C9C9 1.0pt; padding:0cm 5.4pt 0cm 5.4pt;height:10.05pt'>`;
        const tdOpeningTagSpeaker = tdOpeningTagMatches && tdOpeningTagMatches.length > 2 && false ? tdOpeningTagMatches[2] : `<td width=186 valign=top style='width:140pt;border:none;border-bottom:solid #C9C9C9 1.0pt; padding:0cm 5.4pt 0cm 5.4pt;height:10.05pt'>`;


        day.tracks[0].items.forEach(item => {
            table = table + `<tr style='height:10.6pt'> 
                ${tdOpeningTagTime}<p class=MsoNormal>${moment(item.start).format("HH:mm")} - ${moment(item.end).format("HH:mm")}</p></td>
                ${tdOpeningTagTitle}  <p class=MsoNormal><b>${item.title ? item.title : ''}</b>${item.description ? `<br/>${item.description}` : ''}</p></td>
                ${tdOpeningTagSpeaker}<p class=MsoNormal> ${item.speaker ? item.speaker : ''}</p></td>
              </tr>`;
        });

        table = `<table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0
        style='border-collapse:collapse'>
            <tr style='height:20pt'> 
                <td width=161 valign=top style='width:120.5pt;
                padding:0cm 5.4pt 0cm 5.4pt;height:20pt'>
                <p class=MsoNormal>${moment(day.startTime).format('ddd, MMM D')}</p>
                </td>
                <td width=268 valign=top style='width:201.1pt; padding:0cm 5.4pt 0cm 5.4pt;height:20pt'>
                    <p class=MsoNormal><i>Topic</i></p>
                </td>
                <td width=186 valign=top style='width:139.5pt; padding:0cm 5.4pt 0cm 5.4pt;height:20pt'>
                    <p class=MsoNormal><i>Speaker</i></p>
                </td>
            </tr>
            ${table} 
        </table>`;

        return table;

    }



    const handleDataChange = async (data: IAgendaJSON) => {
        console.log("starting");
        Office.context.mailbox.item.body.getAsync(
            Office.CoercionType.Html,
            async (result) => {
                console.log("ending");

                let newItemBody = result.value;
                let jsonString = JSON.stringify(data);
                const newDataString = 'agendaData_start' + JSON.stringify(data) + 'agendaData_end';
                newItemBody = newItemBody.replace(/agendaData_start([\s\S]*)agendaData_end/, newDataString)
                const tables = data.days.map(day => getTable(day, result.value))

                var el = document.createElement('html');
                el.innerHTML = newItemBody;
                const tableElements = el.querySelectorAll('table');
                let parentElement: HTMLElement;
                tableElements.forEach(tableElement => {
                    if (tableElement.innerHTML.includes('Topic') && tableElement.innerHTML.includes('Speaker')) {
                        let tmpEl = document.createElement('div');
                        let renderedTable = tables.shift();
                        tmpEl.innerHTML = renderedTable;
                        if (renderedTable) {
                            tableElement.parentElement.replaceChild(tmpEl.children[0], tableElement);
                            parentElement = tableElement.parentElement;
                        } //delete tables of non existing days
                        else tableElement.parentElement.removeChild(tableElement);
                    }
                })

                //case new days were added, add tables
                while (tables.length > 0) {
                    let tmpEl = document.createElement('div');
                    tmpEl.innerHTML = tables.shift();
                }


                //remove added line break
                el.innerHTML = replaceLast('<p class="MsoNormal">&nbsp;</p>', '', el.innerHTML);
                console.log(el.innerHTML);

                Office.context.mailbox.item.body.setAsync(
                    el.innerHTML,
                    {
                        coercionType: Office.CoercionType.Html,
                        asyncContext: "This is passed to the callback"
                    }
                );

            }
        );
    };



    // const agendaViewModel = new AgendaViewModel({
    //     id: "f4159afc-ca9b-452b-9779-b2fb0289d5ac ",
    //     days: [
    //         {
    //             id: "49982ca2-95b7-4c5e-b0c2-bbe51465736e",
    //             startTime: "2013-02-08T07:00:00.000Z",
    //             endTime: "2013-02-08T16:30:00.000Z",
    //             tracks: [
    //                 {
    //                     id: "dba5df09-95b7-43aa-bae8-8d670a696417",
    //                     name: "",
    //                     items: []
    //                 }
    //             ]
    //         }
    //     ]
    // }, handleDataChange);


    const initializeAgenda = (startDate: Date, endDate: Date) => {
        //case no agenda data found
        const data: IAgendaJSON = {
            id: uuid(),
            days: []
        }

        const days = data.days;
        const start = moment(startDate).set('hours', 0).set('minutes', 1);
        const end = moment(endDate).set('hours', 0).set('minutes', 1);

        if (!end.isSameOrAfter(start)) throw new Error('startDate should be Before or equal endDate');

        const numberOfDays = end.diff(start, 'days', true) + 1;
        console.log(numberOfDays);
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
        agendaEmailBody = `
        <span lang=EN-US style='font-size:8.0pt;color:#D0CECE'>***do not delete or edit after this line***</span><span lang=EN-US> </span>
        <span style='display:none; font-size: 1pt; color: white;'>agendaData_start ${JSON.stringify(data)} agendaData_end</span>
        ${agendaEmailBody}
        <span lang=EN-US style='font-size:8.0pt;color:#D0CECE'>***do not delete or edit before this line – this agenda has been built with the Agenda Builder Outlook Add-In***</span>`

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
                    <InitialScreen initializeAgenda={initializeAgenda}></InitialScreen>
            }
        </>
    )
};

