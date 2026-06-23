import axiosInstance from './axiosInstance'

export const getAllOrders = () => 
  axiosInstance.get('/order')

export const getOrderById = (id) => 
  axiosInstance.get(`/order/${id}`)

export const createOrder = (data) => 
  axiosInstance.post('/order', data)

export const updateOrderStatus = (id, statusId) => 
  axiosInstance.patch(`/order/${id}/status`, statusId)