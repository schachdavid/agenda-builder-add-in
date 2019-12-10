import * as React from "react";
import * as styles from './SettingsDialog.module.css';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { DateRangePicker } from "../RangePicker/DateRangePicker";






interface IProps {
    start: Date;
    end: Date;
    closeDialog: () => void;
    save: (newStart: Date, newEnd: Date) => void;

}

export const SettingsDialog: React.FC<IProps> = ({
    start,
    end,
    closeDialog,
    save,
}: IProps) => {

    const [startDate, setStartDate] = React.useState(start);
    const [endDate, setEndDate] = React.useState(end);
    const [rangeIsValid, setRangeIsValid] = React.useState(true);



    return (
        <Dialog
            onDismiss={closeDialog}
            hidden={false}
            dialogContentProps={{
                type: DialogType.normal,
                title: 'Settings',
                subText: `Change the event's start end and end date.`
            }}
            modalProps={{
                isBlocking: false,
                // topOffsetFixed: true,
                styles: { main: { maxWidth: 450 } }
            }}
        >
            <DateRangePicker
                setRangeIsValid={(newValue: boolean) => setRangeIsValid(newValue)}
                setStartDate={(date: Date) => setStartDate(date)}
                startDate={startDate}
                endDate={endDate}
                setEndDate={(date: Date) => setEndDate(date)}
            />
            <DialogFooter>
                <DefaultButton onClick={closeDialog} text="Cancel" />
                <PrimaryButton onClick={() => {
                    save(startDate, endDate);
                    closeDialog();
                }} disabled={!rangeIsValid} text="Save" />

            </DialogFooter>
        </Dialog >
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
