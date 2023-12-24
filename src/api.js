import { create } from 'apisauce'
import * as axios from 'axios';

axios.defaults.withCredentials = true;

const api = create({
  baseURL: process.env.REACT_APP_API_ROOT,
  withCredentials: true
});

api.addResponseTransform(response => {
  if ((response.status === 401) && !response.headers['no-redirect']) {
    window.location.href = `/login`;
  }
});

const userLogout = () => {
  return api.post(`/v1/logout`);
}

const userLogin = (username, password) => {
  return api.post(
    "/v1/login",
    { username: username, password: password },
    { headers: { "Content-Type": "application/json" } }
  )
}

const getMe = () => {
  return api.post(`/v1/me`);
}

export default api;

export {
  userLogout,
  userLogin,
  getMe
}
