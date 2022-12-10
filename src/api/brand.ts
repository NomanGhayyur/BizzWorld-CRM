import Notify from "../components/shared/Notify";
import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getBrandList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "brandlist"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getBrandDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "branddetail"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const createNewBrand = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "createbrand"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessBrand,onFailureBrand));
};

/**********************************************************************************************/

export const createBrandDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "createbrand"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessBrand,onFailureBrand));
};

/**********************************************************************************************/

export const updateBrandDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "updatebrand"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessBrand,onFailureBrand));
};

/**********************************************************************************************/

export const deleteBrandDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "deletebrand"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessBrand,onFailureBrand));
};

/**********************************************************************************************/

export const getBrandUserList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "userlist"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getBrandType = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "brandtype"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};
export const getBrandMembers = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "taskmemberdetail"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getBrandLeadList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "leadlist"
    params.method = "GET";
    
    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/


export const brandType = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "brandtype"
    params.method = "POST";
    
    return dispatch(dispatchAPI(params));
};

const onSuccessBrand = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'success', message: response.message})

};
const onFailureBrand = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'error', message: response.message})
};