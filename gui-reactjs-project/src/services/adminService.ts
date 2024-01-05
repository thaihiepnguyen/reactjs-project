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

  static async createCourse(data: FormData) {
    return await axiosInstance.post(`/admin/course/create`, data
    )
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

  static async getAllCourse(page: number) {
    return await axiosInstance.get(`/admin/course/all?page=${page}`)
    .then((res) => {
      return Promise.resolve(res.data);
    }).catch((e) => {
      return Promise.reject(e?.response?.data);
    })
  }

  static async putActive(courseId: number, isActive: boolean) {
    try {
      const response = await axiosInstance.put(`/admin/course/putActive/${courseId}`, { isActive });
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error?.response?.data);
    }
  }

  static async searchCourses(page: number, query: string) {
    try {
      const response = await axiosInstance.get('/admin/course/search', {
        params: {
          page: page,
          q: query,
        },
      });
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error?.response?.data);
    }
  }
}
