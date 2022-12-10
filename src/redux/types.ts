import rootReducer from './reducers';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {Action} from 'redux';

export type RootState = ReturnType<typeof rootReducer>;

export type AppThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export type AppThunkDispatch = ThunkDispatch<
  RootState,
  unknown,
  Action<string>
>;
