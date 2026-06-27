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
  permissions: string[];
}

interface LoginRawResponse {
  user: Omit<AuthUser, 'permissions'> & { permissions?: string[] };
  access_token: string;
  permissions?: string[];
}

export async function login(data: LoginPayload): Promise<{ user: AuthUser; access_token: string }> {
  const res = await (api.post('login', data) as unknown as Promise<LoginRawResponse>);
  const user: AuthUser = {
    ...res.user,
    permissions: res.user.permissions ?? res.permissions ?? [],
  };
  return { user, access_token: res.access_token };
}

export async function getProfile(): Promise<AuthUser> {
  const res = await (api.get('me') as unknown as Promise<AuthUser & { permissions?: string[] }>);
  return { ...res, permissions: res.permissions ?? [] };
}

export function logout(): Promise<void> {
  return api.get('logout') as unknown as Promise<void>;
}

export const authApi = { login, getProfile, logout };
