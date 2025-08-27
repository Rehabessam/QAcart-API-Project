import { PORT } from "./constants";
import axios from "axios";

const BASE_URL = "http://192.168.15.119:";

const client = axios.create({
  baseURL: BASE_URL + PORT,
  validateStatus: status => status < 500,
});

export default client;
