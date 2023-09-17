import { AxiosResponse } from "axios";
import { apiRoutes } from "core/routes/routes";
import { authInstance } from "lib/config/axios.config";
import {
  IAddress,
  ICreateRestaurantBody,
  IEditRestaurantBody,
  IRestaurant,
} from "models/restaurants";

class RestaurantService {
  async getRestaurants(): Promise<AxiosResponse<IRestaurant[]>> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await authInstance.get(apiRoutes.RESTAURANT);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getARestaurant(id: number): Promise<AxiosResponse<IRestaurant>> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await authInstance.get(`${apiRoutes.RESTAURANT}/${id}`);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  }

  async createRestaurant(
    body: ICreateRestaurantBody
  ): Promise<AxiosResponse<{ message: string; data: { id: number } }>> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await authInstance.post(apiRoutes.RESTAURANT, body);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  }

  async editRestaurant(
    id: number,
    body: IEditRestaurantBody
  ): Promise<AxiosResponse<{ message: string; data: { id: number } }>> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await authInstance.patch(
          `${apiRoutes.RESTAURANT}/${id}`,
          body
        );
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  }

  async createAddress(
    id: number,
    body: IAddress
  ): Promise<AxiosResponse<{ message: string; data: { id: number } }>> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await authInstance.post(`${apiRoutes.ADDRESS}/${id}`, body);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  }

  async editAddress(
    id: number,
    body: Partial<IAddress>
  ): Promise<AxiosResponse<{ message: string; data: { id: number } }>> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await authInstance.patch(
          `${apiRoutes.ADDRESS}/${id}`,
          body
        );
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new RestaurantService();
