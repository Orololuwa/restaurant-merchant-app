export interface AuthState {
  isLoggedIn: boolean;
  loading: boolean;
  error: string;
}

export interface ILogin {
  user: User;
  access_token: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  address: string;
}

export interface AuthLocationState {
  from?: {
    pathname?: string;
  };
}
