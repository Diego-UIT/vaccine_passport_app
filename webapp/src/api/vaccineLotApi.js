import axiosClient from './axiosClient'

const vaccineLotEndPoint = 'vaccine/lots'

const vaccineLotApi = {
    create: (params) => axiosClient.post(vaccineLotEndPoint, params),
    getOne: (id) => axiosClient.get(`${vaccineLotEndPoint}/${id}`),
    update: (id, params) => axiosClient.put(`${vaccineLotEndPoint}/${id}`, params),
    delete: (id) => axiosClient.delete(`${vaccineLotEndPoint}/${id}`),
}

export default vaccineLotApi