import { ReduxActions } from "../../constants.js";

const INITIAL_STATE = {
  hitsReturned: null,
  totalHits: null,
  projectList: {
    items: [],
    error: null,
    isFetching: false,
    didInvalidate: true,
    lastUpdated: null
  },
  search: {
    type: "ProjectSearchRequest",
    pagination: "true",
    pageSize: 20,
    pageNumber: 1,
    sortOrder: "desc",
    sortBy: "due",
    searchText: "",
    totalRows: 0,
    status: "RECEIVE_PROJECTS_SEARCH",
    didInvalidate: true
  }
};

export const Projects = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case ReduxActions.RECEIVE_PROJECTS_SEARCH:
      return {
        ...state,
        projectList: {
          ...state.projectList,
          items: payload.results,
          error: null,
          isFetching: false,
          didInvalidate: false,
          lastUpdated: payload.receivedAt
        },
        search: {
          ...state.search,
          totalRows: action.totalHits,
          didInvalidate: false
        }
      };
    case ReduxActions.RESET_REDUX:
      return INITIAL_STATE;
    default:
      return state;
  }
};
