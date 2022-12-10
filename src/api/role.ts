import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getRoleList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "role"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};