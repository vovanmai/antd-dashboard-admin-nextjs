import api from '@/lib/api/axiosClient';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
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

export function getUsers(params?: GetUsersParams): Promise<UsersResponse> {
  return api.get('users', { params }) as unknown as Promise<UsersResponse>;
}

export function deleteUser(id: number): Promise<void> {
  return api.delete(`users/${id}`) as unknown as Promise<void>;
}

export const usersApi = { getUsers, deleteUser };
