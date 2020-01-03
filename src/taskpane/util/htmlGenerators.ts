import moment = require("react-event-agenda/node_modules/moment");
import { IDayJSON } from "react-event-agenda/dist/models/DayModel";

/**
 * Creates a html table for the given day of an agenda.
 * 
 * @param {IDayJSON} day - the day to generate the table for
 * @param {string} oldBody - old html body to keep styling
 * @return {string} table as a html string
 */
export const getTable = (dayData: IDayJSON, oldBody?: string): string => {
    let table = '';
    let tableCells;
    if (oldBody) {
        tableCells = oldBody ? oldBody.match(/<td[\s\S]*?<\/td>/g) : undefined;
        //Remove non agenda table cells which are before the agenda tables
        for (let i = 0; i < tableCells.length - 1 && !tableCells[i + 1].includes('Topic');) {
            tableCells.shift();
        }
    }

    //generate table rows
    dayData.tracks[0].items.forEach(item => {
        const time = `${moment(item.start).format("HH:mm")} - ${moment(item.end).format("HH:mm")}`;
        const titleAndDescription = `<b>${item.title ? item.title : ' '}</b>${item.description ? `<br/>${item.description}` : ' '}`;
        const speaker = item.speaker ? item.speaker : ' ';
        //create table data cells
        const tdTime = !oldBody ? getInitialTimeTdStyle(time) : replaceChildrenOfFirstNodeWithTextNode(tableCells[3] ? tableCells[3] : tableCells[0], time);
        const tdTopic = !oldBody ? getInitialTitleAndDescriptionTdStyle(titleAndDescription) : replaceChildrenOfFirstNodeWithTextNode(tableCells[4] ? tableCells[4] : tableCells[1], titleAndDescription);
        const tdSpeaker = !oldBody ? getInitialSpeakerTdStyle(speaker) : replaceChildrenOfFirstNodeWithTextNode(tableCells[5] ? tableCells[5] : tableCells[2], speaker);

        //put table row together
        table = table + `<tr style='height:10.6pt'> 
        ${tdTime}
        ${tdTopic}
        ${tdSpeaker}
      </tr>`;
    });

    //generate table header data cells
    const day = moment(dayData.startTime).format('ddd, MMM D');
    const tdDayHeader = !oldBody ? getInitialDayHeaderTdStyle(day) : replaceChildrenOfFirstNodeWithTextNode(tableCells[0], day);
    const tdTopicHeader = !oldBody ? getInitialTopicHeaderTdStyle() : replaceChildrenOfFirstNodeWithTextNode(tableCells[1], 'Topic');
    const tdSpeakerHeader = !oldBody ? getInitialSpeakerHeaderTdStyle() : replaceChildrenOfFirstNodeWithTextNode(tableCells[2], 'Speaker');

    // put everything together
    table = `<table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0
    style='border-collapse:collapse'>
        <tr style='height:20pt'>
            ${tdDayHeader}
            ${tdTopicHeader}
            ${tdSpeakerHeader}
        </tr>
        ${table} 
    </table>`;
    return table;
}


/**
 * Replaces the children of the first child with a text node child with the given html string.
 * Deletes all siblings of the first child with a text node child.
 */
const replaceChildrenOfFirstNodeWithTextNode = (htmlString: string, newHtmlToInsert: string) => {
    var el = document.createElement('tr');
    el.innerHTML = htmlString;
    let curEl = el.children[0];
    // const newHtmlHasFormatting = newHtmlToInsert.includes('<b>') || newHtmlToInsert.includes('<i>') || newHtmlToInsert.includes('<u>');
    while (curEl.hasChildNodes()) {
        if(curEl.tagName === 'B' || curEl.tagName === 'I' || curEl.tagName === 'U' ) {
            const curElParent = curEl.parentElement;
            const childNodes: Array<Node> = Array.from(curEl.childNodes);
            curEl.replaceWith(...childNodes);
            curEl = curElParent;
        }
        if (hasTextChild(curEl)  ) {
            break;
        }
        curEl = curEl.children[0];

    }
    curEl.innerHTML = newHtmlToInsert;
    //remove all siblings
    const curElParent = curEl.parentElement;
    curElParent.innerHTML = '';
    curElParent.appendChild(curEl);

    return el.innerHTML;
}


/**
 * Check if the given el has a direct text node child.
 * 
 * @param el 
 */
const hasTextChild = (el: Element) => {
    const textChild = Array.from(el.childNodes).find(child => {
        return (child.nodeType === Node.TEXT_NODE || child.nodeName === 'sef' || child.nodeName === 'I' || child.nodeName === 'U')
            && child.textContent.replace(/(\r\n|\n|\r)/gm, "") !== "  " //check that the text node is not a line break
    });
    if (textChild !== undefined) return true;
    return false;
}


//Initial Table Styling
const getInitialDayHeaderTdStyle = (day: string) => {
    return `<td width=161 valign=top style='width:120.5pt; padding:0cm 5.4pt 0cm 5.4pt;height:20pt'>${day}</td>`;
}

const getInitialTopicHeaderTdStyle = () => {
    return `<td width=268 valign=top style='width:201.1pt; padding:0cm 5.4pt 0cm 5.4pt;height:20pt'>Topic</td>`;
}

const getInitialSpeakerHeaderTdStyle = () => {
    return `<td width=186 valign=top style='width:139.5pt; padding:0cm 5.4pt 0cm 5.4pt;height:20pt'>Speaker</td>`;
}

const getInitialTimeTdStyle = (time: string) => {
    return `<td width=160 valign=top style='width:120pt;border:none;border-bottom:solid #C9C9C9 1.0pt; padding:0cm 5.4pt 0cm 5.4pt;height:10.05pt'>${time}</td>`;
}

const getInitialTitleAndDescriptionTdStyle = (content: string) => {
    return `<td width=268 valign=top style='width:200pt;border:none;border-bottom:solid #C9C9C9 1.0pt; padding:0cm 5.4pt 0cm 5.4pt;height:10.05pt'>${content}</td>`;
}

const getInitialSpeakerTdStyle = (speaker: string) => {
    return `<td width=186 valign=top style='width:140pt;border:none;border-bottom:solid #C9C9C9 1.0pt; padding:0cm 5.4pt 0cm 5.4pt;height:10.05pt'>${speaker}</td>`
}