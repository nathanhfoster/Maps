import { combineReducers } from "redux";
import { User } from "./Reducers/User";
import { Projects } from "./Reducers/Projects";
import { Window } from "./Reducers/Window";

export const RootReducer = combineReducers({
  User,
  Projects,
  Window
});
