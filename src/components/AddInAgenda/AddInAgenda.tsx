import * as React from "react";
import Agenda, { AgendaViewModel, IItem } from 'react-event-agenda'
import { SettingsDialog } from "../SettingsDialog/SettingsDialog";
import { ICommandBarItemProps } from "office-ui-fabric-react/lib/CommandBar";
import { DeletedDaysWarning } from '../DeletedDaysWarning/DeletedDaysWarning';
import moment = require("react-event-agenda/node_modules/moment");
import * as styles from './AddInAgenda.module.css';
import uuid = require("uuid");
import { numberToWord } from "../../util/stringUtil";


interface IProps {
    agendaViewModel: AgendaViewModel
}

export const AddInAgenda: React.FC<IProps> = ({
    agendaViewModel
}: IProps) => {
    const [settingsHidden, setSettingsHidden] = React.useState(true);
    const [deletedDaysWarningHidden, setDeletedDaysWarningHidden] = React.useState(true);

    /**
     * Saves the modals settings.
     * 
     * @param {Date} newStartDate 
     * @param {Date} newEndDate 
     */
    const saveSettings = (newStartDate: Date, newEndDate: Date) => {
        const days = agendaViewModel.getDays();
        const momentOldStart = moment(days[0].startTime);
        const momentOldEnd = moment(days[days.length - 1].startTime);
        const momentNewStart = moment(newStartDate);
        const momentNewEnd = moment(newEndDate);
        const oldDiffDays = Math.ceil(momentOldEnd.diff(momentOldStart, 'days', true));
        const newDiffDays = Math.ceil(momentNewEnd.diff(momentNewStart, 'days', true));
        if (newDiffDays < oldDiffDays) {
            const numberToDelete = oldDiffDays - newDiffDays;
            const days = agendaViewModel.getDays();
            for (let i = 0; i < numberToDelete && days.length - 1 - i > 0; i++) {
                agendaViewModel.deleteDay(days[days.length - 1 - i].id);
            }
            setDeletedDaysWarningHidden(false);
        } else if (newDiffDays > oldDiffDays) {
            //add days
            const numberToAdd = newDiffDays - oldDiffDays;
            let day = moment(momentOldEnd).add(1, "day");
            for (let i = 0; i < numberToAdd; i++) {
                agendaViewModel.addDay({
                    id: uuid(),
                    startTime: day.toString(),
                    endTime: day.toString(),
                    uiHidden: true,
                    tracks: [{
                        id: uuid(),
                        name: "",
                        items: [
                            {
                                id: uuid(),
                                start: day.toString(),
                                end: moment(day).add('minutes', 30).toString(),
                                title: `${numberToWord(oldDiffDays + i + 1)} Sample Topic`,
                                speaker: `${numberToWord(oldDiffDays + i + 1)} Sample Speaker`,
                            }
                        ]
                    }
                    ]
                });
                day.add(1, "day");
            }
        }
        const startDateDiffDays = Math.ceil(momentNewStart.diff(momentOldStart, 'days', true));
        if (startDateDiffDays !== 0) agendaViewModel.addDaysToAllDates(startDateDiffDays);
        agendaViewModel.pushToHistory();
        agendaViewModel.applyTotalTrackWidthToTrackVisibility();
    }

    /**
     * @returns {Date} current start date of the agenda.
     */
    const getStartDate = () => {
        const days = agendaViewModel.getDays();
        return days[0].startTime.toDate()
    }


    /**
     * @returns {Date} current end date of the agenda.
     */
    const getEndDate = () => {
        const days = agendaViewModel.getDays();
        return days[days.length - 1].startTime.toDate()
    }

    const customAgendaActionsFar: ICommandBarItemProps[] = [
        {
            key: 'settings',
            ariaLabel: 'settings',
            iconProps: {
                iconName: 'Settings'
            },
            iconOnly: true,
            onClick: () => setSettingsHidden(false)
        }
    ];

   

    return (
        <div className={styles.container}>
            {deletedDaysWarningHidden ? null :
                    <DeletedDaysWarning hide={() => setDeletedDaysWarningHidden(true)}
                        undo={() => {
                            agendaViewModel.undo();
                            setDeletedDaysWarningHidden(true)
                        }} />
            }
            <div className={styles.agendaContainer}>
                <Agenda
                    agendaViewModel={agendaViewModel}
                    customAgendaActionsFar={customAgendaActionsFar}
                ></Agenda>
                {settingsHidden ? null : <SettingsDialog
                    save={saveSettings}
                    closeDialog={() => setSettingsHidden(true)}
                    start={getStartDate()}
                    end={getEndDate()}></SettingsDialog>}
            </div>

        </div >
    )
};

