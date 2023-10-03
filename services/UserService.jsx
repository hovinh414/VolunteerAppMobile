import axios from 'axios';



const loginApi = (username, password) => {
    return axios.post("http://192.168.9.10:3000/api/v1/login", {username, password})
}

const signUpApi = (type, fullname, email, username, password, phone) => {
    return axios.post("http://192.168.9.10:3000/api/v1/signup", {type, fullname, email, username, password, phone})
}

const editUserApi = (userId,fullname, email, username, phone, avatar, address) => {
    const headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QzIiwidXNlcklkIjoiNjUxYTVhMTk0ZjU4Y2JjNWY2ZjI2ZTcyIiwiaWF0IjoxNjk2MzUwMTMwLCJleHAiOjE2OTYzNTM3MzB9.J7ucSzgumcCxjXvGaDPhjb18eOoCFJrIMCI4Kcooswo',
        'Content-Type': 'application/json', // Điều này phụ thuộc vào API bạn đang sử dụng
      };
    return axios.put("http://192.168.9.14:3000/api/v1/user?userid=" + userId, {fullname, email, username, phone, avatar, address},headers)
}
export {loginApi, signUpApi, editUserApi};