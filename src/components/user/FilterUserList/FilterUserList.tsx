import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Badge, Button, unmarshalFormData } from "elements";
import useOutsideClick from "../../../hooks/useOutsideClick";
import styles from './filteruserlist.module.css';

type propType = {
    className?: string;
    style?: React.CSSProperties;
    onApply?: (filters: {[key in string]: (string | number)}) => void;
    onRemoveFilter?: (key: string) => void;
    applied?: {[key in string]: (string | number)}
}

const FilterUserList: React.FC<propType> = React.memo((props: React.PropsWithChildren<propType>) => {
    const [show, setShowFilter] = useState<boolean>(false);
    const containerRef = useOutsideClick<HTMLDivElement>(() => setShowFilter(false));
    const formRef = useRef<HTMLFormElement>(null);
    const { onApply, onRemoveFilter } = props;
    const id = useId()

    const onSubmitFilters: React.FormEventHandler<HTMLFormElement> = useCallback((e) => {
        e.preventDefault();
        if(formRef.current && onApply) {
            const formData = new FormData(formRef.current);
            onApply(unmarshalFormData(formData))
        }
    }, [onApply])

    const applied = useMemo(() => {
        return Object.keys(props.applied || {}).reduce((result, key) => {
            result[key] = (props.applied?.[key] as (string | number));
            return result;
        }, {} as {[key in string]: (string | number)})
    }, [props.applied])

    const renderAppliedFilterBadge = useMemo(() => {

        return (
            <div className={styles.filterUserList__badgeContainer}>
                {Object.keys(applied).filter(k => applied[k]).map((key: string) => {
                    const value = applied[key];
                    return (
                        <Badge 
                            key={key}
                            onRemove={() => onRemoveFilter?.(key)}>
                            {value.toString()}
                        </Badge>
                    )
                })}
            </div>
        )
    }, [applied, onRemoveFilter])

    return (
        <div ref={containerRef} className={`${styles.filterUserList__container} ${props.className || ""}`} style={props.style}>
            {renderAppliedFilterBadge}
            <Button iconName="filter" type="light" onClick={setShowFilter.bind(this, !show)}>
                Add Filter
            </Button>
            {show && (
                <form ref={formRef} className={styles.filterUserList__popupContainer} onSubmit={onSubmitFilters}>
                    <div className={styles.filterUserList__filterRow}>
                        <p><strong>User Role:</strong></p>
                        <div>
                            <div>
                                <input type="radio" id={id} name="role" value={""} defaultChecked={!applied?.["role"]} />
                                <label htmlFor={id}>All</label>
                            </div>
                        </div>
                    </div>
                    <Button htmlType="submit">
                        Apply Filters
                    </Button>
                </form>
            )}
        </div>
    )
});

export default FilterUserList;
