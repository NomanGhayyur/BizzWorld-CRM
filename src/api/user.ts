
import Notify from "../components/shared/Notify";
import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getAllUserList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "alluserlist"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getWorkerUserList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "workeruserlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getUserDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "userdetails"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const createNewUser = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "adduser"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessUser,onFailureUser));
};

/**********************************************************************************************/

export const deleteUser = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "deleteuser"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessUser,onFailureUser));
};
/**********************************************************************************************/

export const updateUserDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "updateuser"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessUser,onFailureUser));

};

/**********************************************************************************************/

export const getUserBrandList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "userbrandlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/
export const getUserList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "userlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/
export const deleteUserFromBrand = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "removeuserfrombrand"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessUser,onFailureUser));
};

/**********************************************************************************************/

export const addCommission = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "addcommission"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessUser,onFailureUser));
};

/**********************************************************************************************/

export const getRemainingBrandList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "remainingbrandlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getRoleUserList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "rolesuserlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

const onSuccessUser = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'success', message: response.message})

};
const onFailureUser = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'error', message: response.message})
};