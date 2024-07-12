import axios from 'axios'
const baseUrl = '/api/users'

const getAll = () => {
    return axios.get(baseUrl).then(res => res.data)
}

const signUp = (newUser) => {
    return axios.post(baseUrl, newUser).then(res => res.data)
}

export default { getAll, signUp }