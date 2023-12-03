import axiosInstance from "@/app/routers/axios";

export default class AdminService {
  static async getAllUser() {
    return await axiosInstance.get(`/admin/account/all`)
    .then((res) => {
      return Promise.resolve(res.data);
    }).catch((e) => {
      return Promise.reject(e?.response?.data);
    })
  };
}
