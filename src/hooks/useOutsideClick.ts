import { useEffect, useRef } from "react";

const useOutsideClick = <T = HTMLDivElement>(handler: (e: MouseEvent) => void) => {
    const containerRef = useRef<T>(null);
    
    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (containerRef.current instanceof HTMLElement && !containerRef.current?.contains(e.target as Node)) {
                handler(e);
            }
        }
        document.addEventListener('click', onClickOutside);
        return () => {
            document.removeEventListener('click', onClickOutside);
        }
    }, [handler]);

    return containerRef;
}

export default useOutsideClick;