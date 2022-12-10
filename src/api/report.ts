
import Notify from "../components/shared/Notify";
import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

/**********************************************************************************************/

export const getSalesTargetReport = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "salestargetreport"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getCommissionReport = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "commissionreport"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getNonTargetReport = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "nontargetlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getTargetReport = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "targetlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getTargetDetails = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "usertargetdetails"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const addTarget = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "addtarget"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccess,onFailure));
};

/**********************************************************************************************/

export const updateTarget = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "updatetarget"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccess,onFailure));
};

/**********************************************************************************************/

export const commissionList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "commissionlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

const onSuccess = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'success', message: response.message})

};
const onFailure = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'error', message: response.message})
};