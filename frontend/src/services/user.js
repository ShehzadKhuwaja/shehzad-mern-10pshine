import axios from 'axios'
const baseUrl = '/api/users'


let token = null
let userId = null

const setUserToken = newToken => {
    token = `bearer ${newToken}`
}

const setUserId = (id) => {
    userId = id
}

const getAll = () => {
    return axios.get(baseUrl).then(res => res.data)
}

const getUser = () => {
    const config = {
        headers: { Authorization: token }
    }

    return axios.get(`${baseUrl}/${userId}`, config).then(res => res.data)
}

const updateUser = (newObject) => {
    const config = {
        headers: { Authorization: token }
    }

    return axios.put(baseUrl, newObject, config).then(res => res.data)
}

const signUp = (newUser) => {
    return axios.post(baseUrl, newUser).then(res => res.data)
}

export default { getAll, signUp, setUserToken, getUser, setUserId, updateUser }