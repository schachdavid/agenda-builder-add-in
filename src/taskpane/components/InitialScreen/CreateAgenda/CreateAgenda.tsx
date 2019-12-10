import * as React from "react";
import * as styles from './CreateAgenda.module.css';
import { PrimaryButton } from 'office-ui-fabric-react';
import { DateRangePicker } from "../../RangePicker/DateRangePicker";







interface IProps {
    initializeAgenda: (startDate: Date, endDate: Date) => void
}

export const CreateAgenda: React.FC<IProps> = ({ initializeAgenda }: IProps) => {

    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());
    const [rangeIsValid, setRangeIsValid] = React.useState(true);



    return (
        <>
            <div className={styles.instructions}>
                Create an agenda for your meeting or event.
    </div>
            <DateRangePicker
                setRangeIsValid={(newValue: boolean) => setRangeIsValid(newValue)}
                setStartDate={(date: Date) => setStartDate(date)}
                startDate={startDate}
                endDate={endDate}
                setEndDate={(date: Date) => setEndDate(date)}
            />
            <PrimaryButton disabled={!rangeIsValid} text="Create Agenda" onClick={() => initializeAgenda(startDate, endDate)} className={styles.button} />

        </>
    )
};
