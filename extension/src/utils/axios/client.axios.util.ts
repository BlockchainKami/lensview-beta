import axios from "axios";

const { VITE_APP_API_URL } = import.meta.env;

const clientAxiosUtil = axios.create({
  baseURL: VITE_APP_API_URL,
  timeout: 180000
});

export default clientAxiosUtil;
