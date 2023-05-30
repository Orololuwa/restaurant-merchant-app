import { IBaseStoreState } from "./base";

export interface AuthState {
  isLoggedIn: boolean;
  loading: boolean;
  error: string;
  profile: IBaseStoreState<IProfile | null>;
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

export interface IProfile {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  setupComplete: boolean;
}
