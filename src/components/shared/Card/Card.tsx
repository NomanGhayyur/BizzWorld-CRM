import React from 'react';
import { ColorSchemes } from 'elements';

type propType = {
    className?: string;
    style?: React.CSSProperties;
    type?: ColorSchemes;
    header?: JSX.Element | null | string;
    title?: string;
    border?: ColorSchemes;
}

const Card = React.memo<React.PropsWithChildren<propType>>(props => {
    return (
        <div className={`card ${props.type ? `bg-${props.type}`: ""} ${props.border ? `bg-${props.border}`: ""} ${props.className || ""}`} style={props.style}>
            {props.header ? (
                <div className="card-header">
                    {props.header}
                </div>
            ) : null}
            <div className="card-body">
                {props.title ? (
                    <h4 className="card-title">{props.title}</h4>
                ) : null}
                {props.children}
            </div>
        </div>
    )
});

export default Card;