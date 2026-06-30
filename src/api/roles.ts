import api from '@/api/axiosClient';

export interface Role {
  id: number;
  name: string;
  display_name: string;
}

export function getRoles(params: any = {}): Promise<Role[]> {
  return api.get('roles', {params: params}) as unknown as Promise<Role[]>;
}

export const rolesApi = { getRoles };
