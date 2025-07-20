import api from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (payload: LoginPayload) => {
  const res = await api.post('/auth/login', payload);
  return res.data;
};