import axios from "axios";
const { REACT_APP_API_URL } = process.env;

const base = {
  Accept: "*/*"
};

const baseHeaders = {
  ...base,
  "Cache-Control": "no-cache",
  "Content-Type": "application/json"
};

const baseFormHeaders = payload => ({
  ...base,
  "Accept-Language": "en-US,en;q=0.8",
  "Content-Type": `multipart/form-data; boundary=${payload._boundary}`
});

const Axios = (token, pagination) =>
  axios.create({
    withCredentials: token ? true : false,
    baseURL: pagination ? pagination : REACT_APP_API_URL,
    timeout: 25000,
    crossDomain: true,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          ...baseHeaders
        }
      : baseHeaders
  });

const AxiosForm = (token, payload) =>
  axios.create({
    baseURL: REACT_APP_API_URL,
    timeout: 25000,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          ...baseFormHeaders(payload)
        }
      : baseFormHeaders(payload)
  });

export { Axios, AxiosForm };
