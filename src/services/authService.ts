import api from './api';
import { LoginPayload } from '../types';

export const login = async (payload: LoginPayload) => {
  const res = await api.post('/auth/login', payload);
  return res.data;
};