import axiosInstance from "@/app/routers/axios";

export default class UserService {
  static CreateUser = () => {
    //API.get....
  };
  static async UpdateProfile(data: FormData): Promise<any> {
    return await axiosInstance
      .post(`/user/profile`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getMe() {
    return await axiosInstance
      .get(`/user/profile`)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async resetPassword(data: FormData): Promise<void> {
    return await axiosInstance
      .post(`/auth/reset-password`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}
