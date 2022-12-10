import React, { useId } from 'react';
import useStyles from './lighttoast.styles';
import { css, Icon, ColorSchemes, IconNames } from 'elements';

const iconMaps: {[key in ColorSchemes]: IconNames} = {
    success: "check-circle",
    danger: "x-octagon",
    info: "info-circle",
    warning: "exclamation-triangle",
    dark: "info-circle",
    light: "info-circle",
    link: "info-circle",
    primary: "info-circle",
    secondary: "info-circle"
};

type propTypes = {
    className?: string;
    style?: React.CSSProperties;
    type?: ColorSchemes;
    message?: string;
    show?: boolean;
}

export interface ILightToast {

}

const LightToast = React.forwardRef<ILightToast, propTypes>((props, ref) => {
    const styles = useStyles();
    const id = useId();

    return (
        <div id={id} className={`${css(styles.container)} ${props.className || ""}`}>
            <Icon name={iconMaps[props.type || "success"]}/>
            <span>{props.message}</span>
        </div>    
    )
});

export default LightToast;
