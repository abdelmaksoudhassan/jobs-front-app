import axios from 'axios'
import {getSession} from './functions'

export default ({ requiresAuth = false } = {}) => {
    const options = {};
    options.baseURL = 'https://nodejs-jobs-5qdy.onrender.com';

    const instance = axios.create(options);

    if (requiresAuth) {
        instance.interceptors.request.use(config=>{
            const {token} = getSession()
            config.headers['Authorization'] = token
            return config
        })
    }

    return instance;
};
