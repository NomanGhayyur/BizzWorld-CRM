import Notify from "../components/shared/Notify";
import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getFreshLeadList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "freshleadlist"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const submitFreshLead = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "savefreshlead"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessLead,onFailureLead));
};

/**********************************************************************************************/

export const addFreshLeadFollowUp = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "savefreshleadfollowup"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessLead,onFailureLead));
};

/**********************************************************************************************/

export const getFreshLeadFollowUp = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "getfreshleadfollowup"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

const onSuccessLead = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'success', message: response.message})

};
const onFailureLead = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'error', message: response.message})
};