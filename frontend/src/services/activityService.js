import api from "../api/axios";

export const getActivities =
  async () => {

    const response =
      await api.get(
        "/physical-activities"
      );

    return response.data;
};

export const createActivity =
  async (data) => {

    const response =
      await api.post(
        "/physical-activities",
        data
      );

    return response.data;
};

export const deleteActivity =
  async (id) => {

    const response =
      await api.delete(
        `/physical-activities/${id}`
      );

    return response.data;
};