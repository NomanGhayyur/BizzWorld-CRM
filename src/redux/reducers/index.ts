import {combineReducers} from 'redux';
import app, { IAppReducer } from './app';
import auth, { IAuthReducer } from './auth';

type Reducer = {
  app: IAppReducer,
  auth: IAuthReducer,
}

export default combineReducers<Reducer>({
  app,
  auth,
});
