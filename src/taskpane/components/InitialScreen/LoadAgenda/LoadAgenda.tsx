import * as React from "react";
import * as styles from './LoadAgenda.module.css';
import { PrimaryButton, Icon } from 'office-ui-fabric-react';







interface IProps {
    checkForData: () => void
}

export const LoadAgenda: React.FC<IProps> = ({ checkForData }: IProps) => {
    const [noDataFound, setNoDataFound] = React.useState(false);

    return (
        <>
            <div className={styles.instructions}>
                The agenda data is saved together with the exported table inside the email. To load or duplicate an agenda:
            </div>
            <ol>
                <li> Open the old email.</li>
                <li> Copy the whole agenda table including the info tags.</li>
                <li> Paste it into this email.</li>
            </ol>
            {noDataFound ? <div className={styles.warning}>
                <Icon iconName={"Error"}/>
                <span>No Data Found</span>
                </div> : null}
            <PrimaryButton text="Check for Data" onClick={async () => {
                await checkForData();
                setNoDataFound(true);
            }}
                className={styles.button} />

        </>
    )
};
