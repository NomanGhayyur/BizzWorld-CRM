import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

export const getCountryList = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "countrylist"
    params.method = "GET";

    return dispatch(dispatchAPI(params));
};