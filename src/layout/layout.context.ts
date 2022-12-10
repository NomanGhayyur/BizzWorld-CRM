import React from "react";

const layoutInitialState = {
    fullSideNav: false
};

const layoutReducer = (state: typeof layoutInitialState, action:any) => {
    return Object.keys(state).reduce((result, key) => {
        if(key in action) {
            result[key as keyof typeof layoutInitialState] = action[key];
        }
        return result;
    }, {} as typeof layoutInitialState)
};

export const useLayoutReducer = (initialState = layoutInitialState) => React.useReducer(layoutReducer, initialState);
export default React.createContext<[typeof layoutInitialState, React.Dispatch<typeof layoutInitialState>]>([layoutInitialState, e=>e]);