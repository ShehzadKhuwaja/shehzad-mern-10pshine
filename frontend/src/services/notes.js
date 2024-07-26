import axios from 'axios'
const baseUrl = '/api/notes'

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = () => {
    const config = {
        headers: { Authorization: token }
    }

    const request = axios.get(baseUrl, config)
    return request.then(response => response.data)
}

const create = async newObject => {
    const config = {
        headers: { Authorization: token }
    }

    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const update = (newObject) => {
    const request = axios.put(`${baseUrl}/${newObject.id}`, newObject)
    return request.then(response => response.data)
}

const deleteNote = async (id) => {
    const config = {
        headers: { Authorization: token }
    }
    await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, setToken, create, update, deleteNote }