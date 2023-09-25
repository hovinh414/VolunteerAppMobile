import axios from 'axios';



const loginApi = (username, password) => {
    return axios.post("http://localhost:3000/api/v1/login", {username, password})
}

const signUpApi = (type, fullname, email, username, password, phone) => {
    return axios.post("http://localhost:3000/api/v1/signup", {type, fullname, email, username, password, phone})
}

export {loginApi, signUpApi};