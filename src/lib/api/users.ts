import api from '@/lib/api/axiosClient';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  can_delete: boolean;
}

export interface UsersMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface UsersResponse {
  data: User[];
  meta: UsersMeta;
}

export interface GetUsersParams {
  page?: number;
  per_page?: number;
  email?: string;
  role_id?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role_id: number;
}

export function getUsers(params?: GetUsersParams): Promise<UsersResponse> {
  return api.get('users', { params }) as unknown as Promise<UsersResponse>;
}

export function deleteUser(id: number): Promise<void> {
  return api.delete(`users/${id}`) as unknown as Promise<void>;
}

export function createUser(payload: CreateUserPayload): Promise<void> {
  const form = new FormData();
  form.append('name', payload.name);
  form.append('email', payload.email);
  form.append('password', payload.password);
  form.append('password_confirmation', payload.password_confirmation);
  form.append('role_id', String(payload.role_id));
  return api.post('users', form) as unknown as Promise<void>;
}

export const usersApi = { getUsers, deleteUser, createUser };
