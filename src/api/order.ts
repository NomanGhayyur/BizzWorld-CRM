import Notify from "../components/shared/Notify";
import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getOrderList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "orderlist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getOrderDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "orderdetail"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const createOrderDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "createorder"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessOrder,onFailureOrder));
};

/**********************************************************************************************/

export const createOrder = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "createorder"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessOrder,onFailureOrder));
};

/**********************************************************************************************/

export const deletOrderDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "deleteorder"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getOrderoptionDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "ordertype"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const orderType = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "ordertype"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getOrderQuestionDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "orderquestion"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const orderQuestion = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "orderquestion"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};
/**********************************************************************************************/

export const orderStatus = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "orderstatus"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const updateOrder = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "updateorder"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccessOrder,onFailureOrder));
};

/**********************************************************************************************/

export const updateOrderDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "updateorder"
    params.method = "POST";
    return dispatch(dispatchAPI(params,onSuccessOrder,onFailureOrder));
};

/**********************************************************************************************/

export const getOrderQuestion = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "orderquestion"
    params.method = "POST";
    
    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getTotalAmount = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "ordertotalamount"
    params.method = "POST";
    
    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getTotalTask = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "orderprogress"
    params.method = "POST";
    
    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getForwardedOrderList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "forwardedorderlist"
    params.method = "POST";
    
    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getPickedOrderList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "pickedorderlist"
    params.method = "POST";
    
    return dispatch(dispatchAPI(params));
}

/**********************************************************************************************/

export const getGroupOrderList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "grouporderlist"
    params.method = "POST";
    
    return dispatch(dispatchAPI(params));
}

/**********************************************************************************************/

const onSuccessOrder = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'success', message: response.message})

};
const onFailureOrder = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'error', message: response.message})
};