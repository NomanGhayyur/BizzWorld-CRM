import { Table, IColumnHeading } from "elements";
import { NextPage } from "next";
import React from "react";
import styles from  '../styles/Projects.module.css';

const columnHeadings: Array<IColumnHeading> = [
    {
        keyIndex: "id",
        label: "ID"
    },
    {
        keyIndex: "title",
        label: "TITLE"
    },
    {
        keyIndex: "date-start",
        label: "DATE START"
    },
    {
        keyIndex: "deadline",
        label: "DEADLINE"
    },
    {
        keyIndex: "leader",
        label: "LEADER"
    },
    {
        keyIndex: "completion",
        label: "COMPLITION"
    },
    {
        keyIndex: "stage",
        label: "STAGE"
    }
]

const Projects: NextPage = () => {
    

    return (
        <div className={`${styles.container}`}>
            Projects:
            <Table 
                columnHeadings={columnHeadings}
                data={[{"id": "1", "title":"Project-1"}]}
            />
        </div>
    );
}

export default Projects;