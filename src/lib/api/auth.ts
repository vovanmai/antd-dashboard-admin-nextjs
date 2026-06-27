import api from '@/lib/api/axiosClient';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role_name: string;
  role_display_name: string;
}

export function login(data: LoginPayload): Promise<{ user: AuthUser; access_token: string }> {
  return api.post('login', data) as unknown as Promise<{ user: AuthUser; access_token: string }>;
}

export function getProfile(): Promise<AuthUser> {
  return api.get('me') as unknown as Promise<AuthUser>;
}

export function logout(): Promise<void> {
  return api.get('logout') as unknown as Promise<void>;
}

export const authApi = { login, getProfile, logout };
