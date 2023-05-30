import { AxiosResponse } from "axios";
import { apiRoutes } from "core/routes/routes";
import { authInstance, publicInstance } from "lib/config/axios.config";
import { ILogin, IProfile } from "models/auth";

class AuthService {
  async login(body: {
    email: string;
    password: string;
  }): Promise<AxiosResponse<{ data: ILogin }>> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await publicInstance.post(apiRoutes.SIGN_IN, body);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  }

  async signUp(body: {
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<AxiosResponse<{ data: ILogin }>> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await publicInstance.post(apiRoutes.SIGN_UP, body);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  }

  async getProfile(): Promise<AxiosResponse<{ data: IProfile }>> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await authInstance.get(apiRoutes.PROFILE);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new AuthService();
