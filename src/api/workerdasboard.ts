import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../redux/types";

/**********************************************************************************************/

export const getWorkerDashboard = (params:IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.path = "workerdashboard"
    params.method = "POST";

    return dispatch(dispatchAPI(params));
};

/**********************************************************************************************/