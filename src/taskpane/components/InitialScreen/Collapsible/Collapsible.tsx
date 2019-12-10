import * as React from "react";
import * as styles from './Collapsible.module.css';
import { Icon } from 'office-ui-fabric-react';
import moment = require("react-event-agenda/node_modules/moment");



interface Item {
    name: string,
    collapsed: boolean
}


interface IProps {
    item: Item,
    children: React.ReactChild

}

export const Collapsible: React.FC<IProps> = ({
    item,
    children
}: IProps) => {

    const [collapsed, setCollapsed] = React.useState(item.collapsed);


    const flipItemCollapse = () => {
        setCollapsed(!collapsed);
    };


    return (
        <div>
            <div className={styles.item} onClick={() => flipItemCollapse()}>
                {item.name}
                <Icon iconName={collapsed ? "ChevronUp" : "ChevronDown"}></Icon>
            </div>
            {collapsed? <div className={styles.itemContent}>
                {children}
            </div> : null}
        </div>
    )
};


