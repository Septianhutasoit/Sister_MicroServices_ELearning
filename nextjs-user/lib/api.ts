import axios from "axios";

const AUTH_API = axios.create({
    baseURL: "http://172.30.59.79:3001",
});

export default AUTH_API;