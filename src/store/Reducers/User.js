import { ReduxActions } from "../../constants.js";

const INITIAL_STATE = {
  token: null,
  id: null,
  options: {
    isFetching: false,
    isSaving: false,
    didInvalidate: true,
    error: null,
    items: []
  },
  location: {
    altitude: null,
    latitude: 38.620744200000004,
    longitude: -121.25949069999999,
    speed: null,
    timestamp: null
  }
};

export const User = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case ReduxActions.USER_SET:
      return { ...state, ...payload };
    case ReduxActions.USER_SET_SOCIAL_AUTHENTICATION:
      return {
        ...state,
        SocialAuthentication: payload
      };
    case ReduxActions.USER_UPDATE_LOADING:
      return {
        ...state,
        updating: true,
        updated: false
      };
    case ReduxActions.USER_UPDATE_SUCCESS:
      return {
        ...state,
        ...payload,
        updating: false,
        updated: true,
        error: null
      };
    case ReduxActions.USER_CLEAR_API:
      return {
        ...state,
        posting: false,
        posted: false,
        updating: false,
        updated: false,
        error: null
      };
    case ReduxActions.USER_SET_SETTINGS:
      return {
        ...state,
        Settings: payload
      };
    case ReduxActions.SET_USER_LOCATION:
      return { ...state, location: { ...state.location, ...payload } };
    case ReduxActions.USER_SET_LOGOUT:
      return INITIAL_STATE;
    case ReduxActions.RESET_REDUX:
      return INITIAL_STATE;
    default:
      return { ...state };
  }
};
