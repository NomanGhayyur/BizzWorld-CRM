import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

let middlewares = [thunk];
let appliedMiddlewares = applyMiddleware(...middlewares);

if (process?.env?.NODE_ENV && process?.env?.NODE_ENV != "production")
appliedMiddlewares = composeWithDevTools(applyMiddleware(...middlewares))

export const createReduxStore = (preloadedState = {}) => {
  return createStore(
    reducers,
    preloadedState,
    appliedMiddlewares,
  );
};
