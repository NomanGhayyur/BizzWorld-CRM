import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

/**********************************************************************************************/

export const getAdminDashboard = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "admindashboard"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getAdminBrandDetails = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "adminbranddetails"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getAdminStatsDetails = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "portaladmindashboard"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getAdminGraphDetails = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "upcomingpaymentdashboard"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/