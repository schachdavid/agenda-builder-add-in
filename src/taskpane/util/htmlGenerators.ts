import moment = require("react-event-agenda/node_modules/moment");
import { IDayJSON } from "react-event-agenda/dist/models/DayModel";

/**
 * Creates a html table for the given day of an agenda.
 * 
 * @param {IDayJSON} day - the day to generate the table for
 * @param {string} oldBody - old html body to keep styling
 * @return {string} table as a html string
 */
export const getTable = (day: IDayJSON, oldBody?: string): string => {
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