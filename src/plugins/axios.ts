import axios from 'axios';
const instance = axios.create({
  baseURL: "https://localhost:7131",
 
});

instance.interceptors.response.use(
  response=>response,
  error => {
    if (error.response.status == 400){
      return error.response;
    } 
    if (error.response.status === 401) {
      console.log("401 error handled")
    } else if (error.response.status === 404) {
      console.log("404 error handled")
    }
    else if (error.response.status == 500){
      console.log("500 error handled");
    }
    else return Promise.reject(error);
  }
);

export default instance;