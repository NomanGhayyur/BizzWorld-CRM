import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getCityList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "citieslist"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};