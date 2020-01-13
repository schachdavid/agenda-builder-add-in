import * as React from "react";
import { MessageBarButton, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import * as styles from './DeletedDaysWarning.module.css';



interface IProps {
    hide: () => void, 
    undo: () => void
}

export const DeletedDaysWarning: React.FC<IProps> = ({
    hide,
    undo
}: IProps) => {




    return (
        <MessageBar
        className={styles.messageBar}
    messageBarType={MessageBarType.warning}
    isMultiline={false}
    onDismiss={hide}
    styles={{root: {backgroundColor: '#FEF4D9'}}}
    dismissButtonAriaLabel="Close"
    actions={
      <div>
        <MessageBarButton onClick={undo}>Undo</MessageBarButton>
      </div>
    }
  >
    By reducing the event's number of days you deleted days and their agenda items.
  </MessageBar>
    )
};


