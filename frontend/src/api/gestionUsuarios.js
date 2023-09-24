import axios from 'axios'


const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
})


export const login = (user) => {
    return SIAPAPI.post('login', user);
  };