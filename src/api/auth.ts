import Notify from "../components/shared/Notify";
import { dispatchAPI, IApiParam } from "../helper/api";
import { setAuthUser } from "../redux/actions/auth";
import { AppThunkDispatch } from "../redux/types";

/**********************************************************************************************/

export const login = (params:IApiParam) => (dispatch: AppThunkDispatch) => {
    params.path = "login"
    params.method = "POST";
    // return dispatch(dispatchAPI(params, onSuccessLogin));
    return dispatch(dispatchAPI(params,onSuccessLogin,onFailureLogin));

};

 const onSuccessLogin = (response:any, params: IApiParam) => (dispatch: AppThunkDispatch) => {
    dispatch(setAuthUser({...response.data,path:response?.path}))
 }

/**********************************************************************************************/

export const logout = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "logout"
    params.method = "POST";

    return dispatch(dispatchAPI(params, onSuccessLogout));
};

const onSuccessLogout = (response:any, params: IApiParam) => (dispatch: AppThunkDispatch) => {
    dispatch(setAuthUser(null))
}

const onFailureLogin = (response:any) => (dispatch:AppThunkDispatch) => {
    Notify({type:'error', message: "Email or Password is incorrect"})
};