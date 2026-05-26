import axios from "axios";

const API = axios.create({
    baseURL: "http://172.30.59.189",
    headers: {
        "Content-Type": "application/json",
    },
});

export default API;