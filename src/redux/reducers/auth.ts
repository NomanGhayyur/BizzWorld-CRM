import moment from "moment";
import { IUser } from "../../model/user";
export interface IAuthReducer {
    user: IUser | null
}

const initialState: IAuthReducer = {
    user: null,
};

const auth = (state: IAuthReducer = initialState, action: any) => {
    switch (action.type) {
        case 'auth/SET_AUTH_USER':
            return (state = {
                ...state,
                user: action.user,
            });
        default:
            return state;
    }
};

export default auth;
