import { dispatchAPI, IApiParam } from "../helper/api";
import { setCountries, setGroupRoutes, setRoles, setRoutes } from "../redux/actions/app";
import { AppThunkDispatch, RootState } from "../redux/types";

export const getBlobFile = (params:IApiParam) => (dispatch: AppThunkDispatch) => {
    if (!params.path) {
        throw new Error("Path is missing");
    }

    params.responseType = "blob";
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getRoles = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "role"
    params.method = "GET";
    
    return dispatch(dispatchAPI(params, onSuccessGetRoles));
};

const onSuccessGetRoles = (response: any, params: IApiParam) => (dispatch: AppThunkDispatch) => {
    console.log("onSuccessGetRoles", response);
    dispatch(setRoles(response.data))
}

/**********************************************************************************************/

export const getCountryList = (params: IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "countrylist"
    params.method = "GET";
    return dispatch(dispatchAPI(params, onSuccessCountryList));
}

export const onSuccessCountryList = (response: any, params: IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    console.log("onSuccessCountryList", response);
    dispatch(setCountries(response.data))
}

/**********************************************************************************************/

export const getStatesByCountry = (params: IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "stateslist"
    params.method = "GET";
    return dispatch(dispatchAPI(params));
}

/**********************************************************************************************/

export const getRoutes = (params: IApiParam = {}) => async (dispatch: AppThunkDispatch, getState: () => RootState) => {
    // if(getState().app.routes && getState().app.routes.length > 0) return getState().app.routes;
    const response = await fetch(`/api/routes`);
    const routes = await response.json()
    dispatch(setRoutes(routes));
    return routes;
}
/**********************************************************************************************/

export const getRouteGroups = (params: IApiParam = {}) => async (dispatch: AppThunkDispatch, getState: () => RootState) => {
    // if(getState().app.groupedRoutes && getState().app.groupedRoutes.length > 0) return getState().app.groupedRoutes;
    const response = await fetch(`/api/routes/group`);
    const routes = await response.json()
    dispatch(setGroupRoutes(routes))
    return routes;
}

/**********************************************************************************************/
export const updateRoute = (params: IApiParam = {}) => async (dispatch: AppThunkDispatch, getState: () => RootState) => {
    const response = await fetch(`/api/routes/edit`, {
        body: JSON.stringify(params.data),
        method: "PUT",
        headers: {
            'Content-Type': "application/json"
        }
    });
    const routes = await response.json()
    
    return routes;
}
/**********************************************************************************************/
