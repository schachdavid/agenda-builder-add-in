import * as React from "react";
import Agenda, { AgendaViewModel } from 'react-event-agenda'
import { SettingsDialog } from "../SettingsDialog/SettingsDialog";
import { ICommandBarItemProps } from "office-ui-fabric-react/lib/CommandBar";
import { DeletedDaysWarning } from '../DeletedDaysWarning/DeletedDaysWarning';
import moment = require("react-event-agenda/node_modules/moment");
import * as styles from './AddInAgenda.module.css';





interface IProps {
    agendaViewModel: AgendaViewModel
}

export const AddInAgenda: React.FC<IProps> = ({
    agendaViewModel
}: IProps) => {
    const [settingsHidden, setSettingsHidden] = React.useState(true);
    const [deletedDaysWarningHidden, setDeletedDaysWarningHidden] = React.useState(true);


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
        }
        const startDateDiffDays = Math.ceil(momentNewStart.diff(momentOldStart, 'days', true));
        if (startDateDiffDays !== 0) agendaViewModel.addDaysToAllDates(startDateDiffDays);
        agendaViewModel.pushToHistory();
    }

    const getStartDate = () => {
        const days = agendaViewModel.getDays();
        return days[0].startTime.toDate()
    }



    const getEndDate = () => {
        const days = agendaViewModel.getDays();
        return days[days.length - 1].startTime.toDate()
    }


    return (
        <div className={styles.container}>
            {deletedDaysWarningHidden ? null :
                <div className={styles.message}>
                    <DeletedDaysWarning hide={() => setDeletedDaysWarningHidden(true)}
                        undo={() => {
                            agendaViewModel.undo();
                            setDeletedDaysWarningHidden(true)
                        }} />
                </div>
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

