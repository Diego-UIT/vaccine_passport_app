import axiosClient from './axiosClient'

const vaccineEndPoint = 'vaccine'

const vaccineApi = {
    getAll: () => axiosClient.get(vaccineEndPoint),
    create: (params) => axiosClient.post(vaccineEndPoint, params),
    getOne: (id) => axiosClient.get(`${vaccineEndPoint}/${id}`),
    update: (id, params) => axiosClient.put(`${vaccineEndPoint}/${id}`, params),
    delete: (id) => axiosClient.delete(`${vaccineEndPoint}/${id}`),
}

export default vaccineApi