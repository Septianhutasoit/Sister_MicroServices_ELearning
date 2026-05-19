import axios from "axios";

const API = axios.create({

    baseURL: "http://192.168.92.79",

});

export default API;