import api from '../api/axiosConfig';

const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export default {
  getAllUsers,
};
