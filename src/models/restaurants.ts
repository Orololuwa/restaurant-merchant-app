import { IBaseStoreState } from "./base";

export interface IRestaurantState {
  restaurants: IBaseStoreState<IRestaurant[]>;
  restaurant: IBaseStoreState<Partial<IRestaurant> | null>;
}

export interface IRestaurant {
  id: number;
  name: string;
  email: string;
  description: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedIn?: string;
  address?: IAddress | null;
  setupComplete?: boolean;
}

export interface ICreateRestaurantBody {
  name: string;
  email: string;
  logo: string;
  description: string;
}

export type IEditRestaurantBody = Partial<Omit<IRestaurant, "id" | "email">>;

export interface IAddress {
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: number;
}
