import axios from "axios";

const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const axiosRequest = axios.create({
  baseURL: baseUrl,

});

export default axiosRequest;
