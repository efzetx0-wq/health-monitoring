import api from "../api/axios";

export const getDailyTargets =
  async () => {

    const response =
      await api.get(
        "/daily-targets"
      );

    return response.data;
};

export const createDailyTarget =
  async (data) => {

    const response =
      await api.post(
        "/daily-targets",
        data
      );

    return response.data;
};

export const deleteDailyTarget =
  async (id) => {

    const response =
      await api.delete(
        `/daily-targets/${id}`
      );

    return response.data;
};