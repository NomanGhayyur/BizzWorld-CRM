import { Card, Table } from "elements";
import React, { useState } from "react"
import styles from '../../../styles/brand/Brand.module.css';


type propTypes = {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    data: any;
    headings: headingType;
}

export type headingValue = string | { key: string, transform?: (value: any) => string | JSX.Element | null }
export type headingType = {
    [key: string]: headingValue
}
const OverviewTable = React.memo<propTypes>((props: propTypes) => {
    const [borderView, setBorderView] = useState<boolean>(false);
    
    const renderItem = (value: headingValue) => {
        if (!props.data) return null;
        if (typeof value == "string") {
            return (
                <p className="lead mb-0">
                    {value.split(",").map(v => props.data?.[v]).join(" ")}
                </p>
            )
        } else {
            if (!value.transform) return (
                <p className="lead mb-0">
                    {value.key.split(",").map(v => props.data?.[v]).join(" ")}
                </p>
            )
            return value.key.split(",").map(v => value?.transform?.(props.data?.[v]))
        }
    }

    return (
        // <div id={props.id} style={props.style} className={props.className}>
        //     {Object.keys(props.headings).map((key: string) => {
        //         const value = props.headings[key];
        //         if (value) {
        //             return (
        //                 <div className="d-flex flex-row align-items-center m-1" key={key}>
        //                     <div className="gutter-row" style={{ flex: 0.35 }}>
        //                         <h5 className="mb-0">{key}:</h5>
        //                     </div>
        //                     <div className="gutter-row mt-1 mb-1" style={{ flex: 0.65 }}>
        //                         {renderItem(value)}
        //                     </div>
        //                 </div>
        //             )
        //         }
        //         return null;
        //     })}
        // </div>
        <div className={`table_card ${styles.dataWrapper}`}>
        {borderView ? (
            <React.Fragment>
                {[].map((brand: any) => (
                    <Card className={styles.userCard} key={brand.brand_id} header={brand.brand_email}>
                        {brand.brand_name}
                    </Card>
                ))}
            </React.Fragment>
        ) : (
            <Table
                
                // onSortData={(sortKey, direction) => setSortKeys({ [sortKey as keyof IBrandListItem]: direction })}
                autoSort={false}
                loading={false}
                onRowItemClick={(p) => console.log(p)}
                onPageChange={(p) => console.log(p)}
                data={[]}
                columnHeadings={[]}
                style={{marginTop:'30px'}}
                />
        )}
    </div>
    );
});

export default OverviewTable;