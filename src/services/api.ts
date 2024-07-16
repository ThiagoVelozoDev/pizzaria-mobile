import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.237.220:3333'
})

export {api};