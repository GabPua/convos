import axios from 'axios'

const app = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_SERVER + 'api/',
  withCredentials: true,
})

app.interceptors.response.use(
  response => response.data,
  error => {
    const err = error?.response?.data?.err
    return Promise.reject(err ? err : error.messge)
  }
)

export default app
