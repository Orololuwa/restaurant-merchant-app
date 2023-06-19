import { AxiosResponse } from "axios";
import { apiRoutes } from "core/routes/routes";
import { authInstance } from "lib/config/axios.config";
import { IRestaurant } from "models/restaurants";

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
}

export default new RestaurantService();
