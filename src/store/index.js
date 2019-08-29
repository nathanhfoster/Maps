import { RootReducer } from "./reducers";
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
const { NODE_ENV } = process.env;
const INITIAL_STATE = {};

export default (state = INITIAL_STATE) => {
  const inDevelopmentMode = NODE_ENV == "development";
  return inDevelopmentMode
    ? composeWithDevTools(applyMiddleware(thunk))(createStore)(
        RootReducer,
        state
      )
    : applyMiddleware(thunk)(createStore)(RootReducer, state);
};
