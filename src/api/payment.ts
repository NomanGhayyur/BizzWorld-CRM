import Notify from "../components/shared/Notify";
import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getPaymentList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "orderpaymentlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const updatePaymentStatus = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "updateorderpaymentstatus"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessOrder,onFailureOrder));
};

/**********************************************************************************************/

export const getForwardedPayments = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "forwardedpaymentlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getPickedPayments = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "pickedpaymentlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const pickPayment = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "pickpayment"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessOrder,onFailureOrder));
};

/**********************************************************************************************/

export const unpickPayment = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "unpickpayment"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessOrder,onFailureOrder));
};

/**********************************************************************************************/

export const getPaymentDetails = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "paymentdetails"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const PaymentStatus = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "updatepaymentstatus"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessOrder,onFailureOrder));
};

/**********************************************************************************************/

export const MergeDeal = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "mergedeal"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessOrder,onFailureOrder));
};

/**********************************************************************************************/

export const MergedDealList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "mergepickedpaymentlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const UnMergeDeal = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "unmergedeal"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessOrder,onFailureOrder));
};

/**********************************************************************************************/

export const statusWisePaymentList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "statuswisepaymentlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const mergeStatusWisePaymentList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "mergestatuswisepaymentlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const merchantList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "billingmerchantlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getPaymentAmount = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "paymentamount"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/


const onSuccessOrder = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'success', message: response.message})

};
const onFailureOrder = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'error', message: response.message})
};