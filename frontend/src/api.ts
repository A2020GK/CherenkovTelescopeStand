import axios from "axios";

export const api = axios.create({
    baseURL: `http://${location.hostname}:8000/`
});
