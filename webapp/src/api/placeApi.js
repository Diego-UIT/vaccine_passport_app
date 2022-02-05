import axiosClient from './axiosClient'

const placeEndPoint = 'place'

const placeApi = {
    getAll: () => axiosClient.get(placeEndPoint),
    create: (params) => axiosClient.post(placeEndPoint, params),
    getOne: (id) => axiosClient.get(`${placeEndPoint}/${id}`),
    update: (id, params) => axiosClient.put(`${placeEndPoint}/${id}`, params),
    delete: (id) => axiosClient.delete(`${placeEndPoint}/${id}`),
}

export default placeApi