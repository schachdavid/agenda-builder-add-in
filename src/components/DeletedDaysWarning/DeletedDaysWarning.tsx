import * as React from "react";
import { MessageBarButton, MessageBar, MessageBarType } from 'office-ui-fabric-react';



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


