import * as React from "react";
import * as styles from './CreateScreen.module.css';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { PrimaryButton } from 'office-ui-fabric-react';
import { palette } from "../../colorPalette";






interface IProps {
    initializeAgenda: (startDate: Date, endDate: Date) => void
}

export const CreateScreen: React.FC<IProps> = ({initializeAgenda
}: IProps) => {

    const [startDate, setStartDate] = React.useState<Date>(new Date());
    const [endDate, setEndDate] = React.useState<Date>(new Date());



    return (
        <div className={styles.container} style={{}}>
            <div className={styles.headings} style={{color: palette.white}}>
                <div>
                    <h2>Welcome to the</h2>
                    <h1>AgendaBuilder</h1>
                </div>
            </div>
            <div className={styles.form}>
                <DatePicker
                    label="Start date"
                    isRequired={false}
                    allowTextInput={true}
                    showMonthPickerAsOverlay={true}
                    firstDayOfWeek={DayOfWeek.Monday}
                    strings={DayPickerStrings}
                    value={startDate!}
                    onSelectDate={setStartDate} />
                <DatePicker
                    label="End date"
                    isRequired={false}
                    allowTextInput={true}
                    showMonthPickerAsOverlay={true}
                    firstDayOfWeek={DayOfWeek.Monday}
                    strings={DayPickerStrings}
                    value={endDate!}
                    onSelectDate={setEndDate} />
                <PrimaryButton text="Create Agenda" onClick={() => initializeAgenda(startDate, endDate)} className={styles.button}/>
            </div>
        </div>
    )
};

const DayPickerStrings: IDatePickerStrings = {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

    shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

    goToToday: 'Go to today',
    prevMonthAriaLabel: 'Go to previous month',
    nextMonthAriaLabel: 'Go to next month',
    prevYearAriaLabel: 'Go to previous year',
    nextYearAriaLabel: 'Go to next year',
    closeButtonAriaLabel: 'Close date picker',

    isRequiredErrorMessage: 'Start date is required.',

    invalidInputErrorMessage: 'Invalid date format.'
};
