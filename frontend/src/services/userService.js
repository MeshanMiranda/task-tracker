import api from '../api/axiosConfig';

const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export default {
  getAllUsers,
  updateUser,
  deleteUser,
};
