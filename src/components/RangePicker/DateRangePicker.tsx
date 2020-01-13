import * as React from "react";
import { Icon, ITextFieldProps, DatePicker, IDatePickerStrings, DayOfWeek, PrimaryButton } from 'office-ui-fabric-react';
import moment = require("react-event-agenda/node_modules/moment");






interface IProps {
    startDate: Date,
    endDate: Date,
    setStartDate: (date: Date) => void,
    setEndDate: (date: Date) => void,
    setRangeIsValid: (newValue: boolean) => void;
    endWarningMessage?: string;
}

export const DateRangePicker: React.FC<IProps> = ({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setRangeIsValid,
    endWarningMessage
}: IProps) => {


    const [errorMessage, setErrorMessage] = React.useState(undefined);

    const onSelectStartDate = (date: Date) => {
        const momentOldStart = moment(startDate);
        const momentOldEnd = moment(endDate);
        const diffDays = Math.ceil(momentOldEnd.diff(momentOldStart, 'days', true));
        setStartDate(date);
        setEndDate(moment(date).add(diffDays, 'days').toDate());
    }

    const onSelectEndDate = (date: Date) => {
        const momentStart = moment(startDate);
        const diffDays = Math.ceil(moment(date).diff(momentStart, 'days', true));
        if (diffDays >= 3) { 
            setErrorMessage("The event may take a maximum of 3 days"); 
            setRangeIsValid(false);
        }
        else {
            setErrorMessage(undefined);
            setRangeIsValid(true);
        }
        setEndDate(date);
    }

    const endDateTextFieldProps: ITextFieldProps = { errorMessage: errorMessage }

    return (
        <> <DatePicker
            label="Start date"
            isRequired={false}
            allowTextInput={true}
            showMonthPickerAsOverlay={true}
            firstDayOfWeek={DayOfWeek.Monday}
            strings={DayPickerStrings}
            value={startDate}
            onSelectDate={onSelectStartDate}
        />
            <DatePicker
                label="End date"
                isRequired={false}
                allowTextInput={true}
                showMonthPickerAsOverlay={true}
                firstDayOfWeek={DayOfWeek.Monday}
                strings={DayPickerStrings}
                value={endDate}
                onSelectDate={onSelectEndDate}
                minDate={startDate}
                textField={endDateTextFieldProps} />
        </>
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


