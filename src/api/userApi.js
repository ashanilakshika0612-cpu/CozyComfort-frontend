import axiosInstance from './axiosInstance'

export const getAllUsers = () => 
  axiosInstance.get('/user')

export const getMe = () => 
  axiosInstance.get('/user/me')

export const getUserById = (id) => 
  axiosInstance.get(`/user/${id}`)

export const getUsersByRole = (role) => 
  axiosInstance.get(`/user/by-role/${role}`)

export const updateUser = (id, data) => 
  axiosInstance.put(`/user/${id}`, data)

export const changePassword = (id, data) => 
  axiosInstance.patch(`/user/${id}/change-password`, data)

export const deactivateUser = (id) => 
  axiosInstance.delete(`/user/${id}`)

export const reactivateUser = (id) => 
  axiosInstance.patch(`/user/${id}/reactivate`)