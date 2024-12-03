import axios from "axios";

const baseUrl = "http://206.189.248.140:8080/function/auth-function";

const axiosRequest = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});
// Add a request interceptor to modify the baseURL based on the subpath
axiosRequest.interceptors.request.use(
  (config) => {
    const token = (sessionStorage.getItem('jwt')??{})?.token??""; // Replace 'token' with your session key name
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Check the subpath (URL in the request)
    if (config.url.includes("/posts")) {
      config.baseURL = "http://206.189.248.140:8080/function/post-function"; // Change to a different base URL
    } else if (config.url.includes("/users")) {
      config.baseURL = "http://206.189.248.140:8080/function/user-function"; // Another base URL example
    }
    // Return the modified config
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);
export default axiosRequest;
