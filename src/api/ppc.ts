import Notify from "../components/shared/Notify";
import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getPPCList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "ppclist"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getPPCDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "ppcdetail"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const createNewPPC = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "addppc"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessBrand,onFailureBrand));
};

/**********************************************************************************************/

export const updatePPC = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "updateppc"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessBrand,onFailureBrand));
};

/**********************************************************************************************/

export const deletePPC = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "deleteppc"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessBrand,onFailureBrand));
};

/**********************************************************************************************/

export const getPPCMonth = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "monthlyppcbudget"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

const onSuccessBrand = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'success', message: response.message})

};
const onFailureBrand = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'error', message: response.message})
};