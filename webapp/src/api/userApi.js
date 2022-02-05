import axiosClient from "./axiosClient"

const userEndPoint = 'user'

const userApi = {
    getAll: () => axiosClient.get(userEndPoint),
    create: (params) => axiosClient.post(userEndPoint, params),
    getOne: (id) => axiosClient.get(`${userEndPoint}/${id}`),
    update: (id, params) => axiosClient.put(`${userEndPoint}/${id}`, params),
    delete: (id) => axiosClient.delete(`${userEndPoint}/${id}`),
    vaccinated: (params) => axiosClient.post(`${userEndPoint}/vaccinated`, params)
}

export default userApi