import { ReduxActions } from "../../constants.js";

const INITIAL_STATE = { height: null, width: null, isMobile: null };

export const Window = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case ReduxActions.SET_WINDOW:
      return payload;
    case ReduxActions.RESET_REDUX:
      return INITIAL_STATE;
    default:
      return state;
  }
};
