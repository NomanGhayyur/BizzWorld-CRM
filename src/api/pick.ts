
import Notify from "../components/shared/Notify";
import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

/**********************************************************************************************/

export const getPickedLeadList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "pickedleadlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const pickLead = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "picklead"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessPick,onFailurePick));
};

/**********************************************************************************************/

export const unpicklead = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "unpicklead"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessPick,onFailurePick));
};

/**********************************************************************************************/

export const cancellead = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "cancellead"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessPick,onFailurePick));
};

/**********************************************************************************************/

export const pickOrder = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "pickorder"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessPick,onFailurePick));
};

/**********************************************************************************************/

export const unpickOrder = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "unpickorder"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessPick,onFailurePick));
};

/**********************************************************************************************/

export const updateOrderStatus = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "updateorderstatus"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessPick,onFailurePick));
};

const onSuccessPick = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'success', message: response.message})

};
const onFailurePick = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'error', message: response.message})
};