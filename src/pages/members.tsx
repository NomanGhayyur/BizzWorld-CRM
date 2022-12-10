import { Table, IColumnHeading } from "elements";
import { NextPage } from "next";
import React from "react";
import styles from  '../styles/Members.module.css';

const columnHeadings: Array<IColumnHeading> = [
    {
        keyIndex: "id",
        label: "ID"
    }
]

const Members: NextPage = () => {
    

    return (
        <div className={`${styles.container}`}>
            <Table 
                columnHeadings={columnHeadings}
                data={[{"id": "1"}]}
            />
        </div>
    );
}

export default Members;