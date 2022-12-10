import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";
import Notify from '../components/shared/Notify'



export const getTaskList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "tasklist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getOrderWiseTaskList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "orderwisetasklist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/

export const getTaskDetail = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "taskdetail"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};
/**********************************************************************************************/

export const taskStatus = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "taskstatus"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};
/**********************************************************************************************/

export const statusWiseTask = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "statuswisetasklist"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};
/**********************************************************************************************/

/**********************************************************************************************/

export const moveTask = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "movetask"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccess,onFailure));

};

export const taskDetails = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "taskdetail"

    params.method = "POST";

    return dispatch(dispatchAPI(params));
};
/**********************************************************************************************/

export const updateTask = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "updatetask"

    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccess,onFailure));
};
/**********************************************************************************************/
export const addMemberToTask = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "addmembertotask"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccess,onFailure));
};
export const removeMemberToTask = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "removefromtask"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccess,onFailure));
};
export const createNewTask = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "creattask"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccess,onFailure));
};
export const getTaskComments = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "taskcommentdetail"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};
export const postTaskComments = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "sendcommenttotask"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

export const postTaskReply = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "sendreply"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

export const getTaskReply = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "commentreplydetail"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

export const deleteTask = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "deletetask"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccess,onFailure));

};

export const taskWorkAttachment = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "taskworkattachment"
    params.method = "POST";

    return dispatch(dispatchAPI(params));

};

export const submitWork = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "submitwork"
    params.method = "POST";

    return dispatch(dispatchAPI(params,onSuccess,onFailure));

};

const onSuccess = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'success', message: response.message})

};
const onFailure = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'error', message: response.message})
};