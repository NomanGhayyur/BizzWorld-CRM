
import Notify from "../components/shared/Notify";
import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getLeadList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "leadlist"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getLeadDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "leaddetails"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const createNewLead = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "createlead";
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessLead,onFailureLead));
};

/**********************************************************************************************/

export const updateLeadDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "updatelead";
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessLead,onFailureLead));
};
/**********************************************************************************************/

export const deleteLead = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "deletelead"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessLead,onFailureLead));
};

/**********************************************************************************************/

export const getforwardedLeadList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "forwardedleadlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getAutomanualLeadList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "automanualleadlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

const onSuccessLead = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'success', message: response.message})

};
const onFailureLead = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'error', message: response.message})
};