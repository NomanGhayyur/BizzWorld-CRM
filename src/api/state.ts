import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getStateList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "stateslist"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};