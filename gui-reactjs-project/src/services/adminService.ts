import axiosInstance from "@/app/routers/axios";

export default class AdminService {
  static async getAllUser(page: number) {
    return await axiosInstance.get(`/admin/account/all?page=${page}`)
    .then((res) => {
      return Promise.resolve(res.data);
    }).catch((e) => {
      return Promise.reject(e?.response?.data);
    })
  };

  static async createUser(data: FormData) {
    return await axiosInstance.post(`/admin/account/create`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
    .then((res) => {
      return Promise.resolve(res.data);
    }).catch((e) => {
      return Promise.reject(e?.response?.data);
    })
  };

  static async toggleBlockUser(id: number) {
    return await axiosInstance.delete(`/admin/account/${id}`)
    .then((res) => {
      return Promise.resolve(res.data);
    }).catch((e) => {
      return Promise.reject(e?.response?.data);
    })
  };
}
