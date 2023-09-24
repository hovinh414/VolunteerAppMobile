import axios from 'axios';



const loginApi = (username, password) => {
    return axios.post("http://localhost:3000/api/v1/login", {username, password})
}

export {loginApi};