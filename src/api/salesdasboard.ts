import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

/**********************************************************************************************/

export const getSalesDashboard = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "salesdashboard"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/