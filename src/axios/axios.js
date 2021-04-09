// used to make the defaults and global Intercepters of Axios

import axios from 'axios'
export default [

    axios.interceptors.request.use(
        request => {
            // console.log(request)
            return request
        }, error => {
            // console.log(error)
            return console.error();
        }
    ),
    axios.interceptors.response.use(
        response => {
            // console.log(response)
            return response
        }, error => {
            // console.log(error)
            return console.error();
        }
    )
]