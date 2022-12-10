import Notify from "../components/shared/Notify";
import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getMerchant = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "billingmerchantlist"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getMerhantDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "billingmerchantdetails"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const createNewMerchant = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "addbillingmerchant"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessBrand,onFailureBrand));
};

/**********************************************************************************************/

export const updatemerchantDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "updatebillingmerchant"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessBrand,onFailureBrand));
};

/**********************************************************************************************/

export const deleteMerchant = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "deletebillingmerchant"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessBrand,onFailureBrand));
};

/**********************************************************************************************/

export const withdrawalAmount = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "addwithdrawalamount"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessBrand,onFailureBrand));
};

/**********************************************************************************************/

export const withdrawalAmountList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "withdrawalamountlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

const onSuccessBrand = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'success', message: response.message})

};
const onFailureBrand = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'error', message: response.message})
};