import api from '@/lib/api/axiosClient';

export interface Role {
  id: number;
  name: string;
  display_name: string;
}

export function getRoles(): Promise<Role[]> {
  return api.get('roles') as unknown as Promise<Role[]>;
}

export const rolesApi = { getRoles };
