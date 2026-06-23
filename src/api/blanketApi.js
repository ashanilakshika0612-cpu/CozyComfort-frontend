import axiosInstance from './axiosInstance'

export const getAllBlankets = () => 
  axiosInstance.get('/blanket')

export const getBlanketById = (id) => 
  axiosInstance.get(`/blanket/${id}`)

export const createBlanket = (data) => 
  axiosInstance.post('/blanket', data)

export const updateStock = (id, quantity) => 
  axiosInstance.patch(`/blanket/${id}/stock`, quantity)