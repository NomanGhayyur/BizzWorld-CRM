import Notify from "../components/shared/Notify";
import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

/**********************************************************************************************/

export const getRoleWiseUserList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "rolewiseuserlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const assignPPCBudget = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "assignppc"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessUser,onFailureUser));
};

/**********************************************************************************************/

export const getPPCBudgetDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "assignppcdetail"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getPPCBudgetList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "assignppclist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const deletePPCBudget = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "deleteassignppc"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessUser,onFailureUser));
};

/**********************************************************************************************/


const onSuccessUser = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'success', message: response.message})

};
const onFailureUser = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'error', message: response.message})
};