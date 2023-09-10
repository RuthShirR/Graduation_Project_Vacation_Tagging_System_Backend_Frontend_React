import axios from "axios";
import store from "../Redux/Store";

// --------------------------
// JWT Axios Configuration
// --------------------------

const jwtAxios = axios.create();

// Add an interceptor to attach JWT token to requests, if available.
jwtAxios.interceptors.request.use((request) => {
    const userToken = store.getState().authState.user?.token;
    if (userToken) {
        request.headers.authorization = `Bearer ${userToken}`;
    }
    return request;
});

export default jwtAxios;

