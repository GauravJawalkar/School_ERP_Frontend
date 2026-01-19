import axios from "axios";


const ApiClient = axios.create({
    baseURL: process.env.BASE_URL,
    withCredentials: true
})