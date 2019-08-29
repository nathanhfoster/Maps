import { ReduxActions } from "../constants";
import { Axios } from ".";

const SearchProjects = (token, payload) => dispatch => {
  token = "163c88b0-8c01-11e5-bb53-dd09e7fbdd1b";
  payload = {
    "@type": "ProjectSearchRequest",
    sortField: "lastActivity",
    sortOrder: "desc",
    pageNumber: 1,
    pagination: "true",
    pageSize: 25
  };
  Axios(token)
    .post(`searches/`, JSON.stringify(payload))
    .then(res => {
      // console.log(res.data);
      dispatch({
        type: ReduxActions.RECEIVE_PROJECTS_SEARCH,
        payload: res.data
      });
    })
    .catch(e => console.log("SearchProjects: ", e));
};

export { SearchProjects };
