export interface Agent {
  address: string;
  cin: string;
  date_joined: string;
  date_naissance: string;
  email: string;
  first_name: string;
  groups: any[];
  id: number;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string;
  last_name: string;
  nom: string;
  numertel: string;
  prenom: string;
  role: string;
  temporary_session: boolean;
  user_permissions: any[];
  username: string | null;
}