import axiosInstance from './axiosInstance'

export const getInventory = () => 
  axiosInstance.get('/inventory')

export const getInventoryByDistributor = (id) => 
  axiosInstance.get(`/inventory/distributor/${id}`)

export const checkStock = (distributorId, blanketId, quantity) =>
  axiosInstance.get(`/inventory/check?distributorId=${distributorId}&blanketId=${blanketId}&quantity=${quantity}`)

export const addInventory = (data) => 
  axiosInstance.post('/inventory', data)

export const deductInventory = (data) => 
  axiosInstance.patch('/inventory/deduct', data)