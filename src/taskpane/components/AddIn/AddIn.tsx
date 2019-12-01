import * as React from "react";
import Agenda, { AgendaViewModel } from 'react-event-agenda'
import * as styles from './AddIn.module.css';
import { IAgendaJSON } from 'react-event-agenda/dist/models/AgendaModel';
import moment = require("react-event-agenda/node_modules/moment");
import { CreateScreen } from "../CreateScreen/CreateScreen";
import uuid = require("uuid");
import { IDayJSON } from "react-event-agenda/dist/models/DayModel";






interface IProps {

}

export const AddIn: React.FC<IProps> = ({
}: IProps) => {

    const [agendaInitialized, setAgendaInitialized] = React.useState(false);





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
                ${tdOpeningTagTitle}  <p class=MsoNormal><b>${item.title ? item.title : ''}</b></p></td>
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
                console.log(result.value);

                let newItemBody = result.value;
                let jsonString = JSON.stringify(data);
                console.log(jsonString);
                const newDataString = 'agendaData_start' + JSON.stringify(data) + 'agendaData_end';
                newItemBody = newItemBody.replace(/agendaData_start([\s\S]*)agendaData_end/, newDataString)
                const tables = data.days.map(day => getTable(day, result.value))

                var el = document.createElement('html');
                el.innerHTML = newItemBody;
                const tableElements = el.querySelectorAll('table');
                tableElements.forEach(tableElement => {
                    if (tableElement.innerHTML.includes('Topic') && tableElement.innerHTML.includes('Speaker') && tables.length > 0) {
                        var tmpEl = document.createElement('div');
                        tmpEl.innerHTML = tables.shift();
                        tableElement.parentElement.replaceChild(tmpEl.firstElementChild, tableElement);
                    }
                })
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


    // const handleDataChange = async (data: IAgendaJSON) => {
    //     Office.context.mailbox.item.body.setAsync(
    //         getTable(data),
    //         {
    //             coercionType: Office.CoercionType.Html,
    //             asyncContext: "This is passed to the callback"
    //         }
    //     );
    // };






    const agendaViewModel = new AgendaViewModel({
        id: "f4159afc-ca9b-452b-9779-b2fb0289d5ac ",
        days: [
            {
                id: "49982ca2-95b7-4c5e-b0c2-bbe51465736e",
                startTime: "2013-02-08T07:00:00.000Z",
                endTime: "2013-02-08T16:30:00.000Z",
                tracks: [
                    {
                        id: "dba5df09-95b7-43aa-bae8-8d670a696417",
                        name: "",
                        items: []
                    }
                ]
            }
        ]
    }, handleDataChange);



    if (!Office.context || !Office.context.mailbox || !Office.context.mailbox.item || !Office.context.mailbox.item.body) return null;

    Office.context.mailbox.item.body.getAsync(
        "html",
        function callback(result) {
            const matches = /agendaData_start([\s\S]*)agendaData_end/.exec(result.value);
            if (matches && matches.length > 0) {
                setAgendaInitialized(true);
                let match = matches[0];
                match = match.replace(/(agendaData_end|agendaData_start)*/g, '');
                //replace quot
                match = match.replace(/&quot;/g, '"');
                //remove line breaks
                match = match.replace(/\r?\n|\r/g, ' ');
                console.log(match);
                agendaViewModel.setData(JSON.parse(match));
            }
        }
    );

    const initializeAgenda = (startDate: Date, endDate: Date) => {
        //case no agenda data found
        const data: IAgendaJSON = {
            id: uuid(),
            days: []
        }

        const start = moment(startDate).set('hours', 0).set('minutes', 1);
        const end = moment(endDate).set('hours', 0).set('minutes', 1);


        if (!end.isSameOrAfter(start)) throw new Error('startDate should be Before or equal endDate');

        const numberOfDays = end.diff(start, 'days', true) + 1;
        console.log(numberOfDays);
        let currentDay = moment(start);
        for (let i = 0; i < numberOfDays; i++) {
            const dayStartTime = moment(currentDay).set('hours', 8).set('minutes', 0);
            const dayEndTime = moment(currentDay).set('hours', 19).set('minutes', 0);

            data.days.push({
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



        agendaViewModel.setData(data);
        let agendaEmailBody = '';
        data.days.forEach(day => agendaEmailBody = agendaEmailBody + getTable(day));
        agendaEmailBody = `
        <span lang=EN-US style='font-size:8.0pt;color:#D0CECE'>***do not delete or edit after this line***</span><span lang=EN-US> </span>
        <span style='display:none; font-size: 1pt; color: white;'>agendaData_start ${JSON.stringify(data)} agendaData_end</span>
        ${agendaEmailBody}
        <span lang=EN-US style='font-size:8.0pt;color:#D0CECE'>***do not delete or edit before this line – this agenda has been built with the Agenda Builder Outlook Add-In***</span>`
        console.log(agendaEmailBody);

        Office.context.mailbox.item.body.setSelectedDataAsync(
            agendaEmailBody,
            {
                coercionType: Office.CoercionType.Html,
            }
        );
        setAgendaInitialized(true)

    }





    return (
        <>
            {
                agendaInitialized ?
                    <div style={{ height: '100vh', width: '100vw', maxWidth: '100%' }}>
                        <Agenda agendaViewModel={agendaViewModel}></Agenda>
                    </div> :
                    <CreateScreen initializeAgenda={initializeAgenda}></CreateScreen>
            }

        </>
    )
};

