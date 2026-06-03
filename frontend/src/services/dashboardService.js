import api from "../api/axios";

export const getDailyProgress =
  async () => {

    const response =
      await api.get("/daily-progress");

    return response.data;
};

export const getHealthProfile =
  async () => {

    const response =
      await api.get("/health-profile");

    return response.data;
};

export const getActivities =
  async () => {

    const response =
      await api.get(
        "/physical-activities"
      );

    return response.data;
};

export const getSleepData =
  async () => {

    const response =
      await api.get(
        "/sleep-trackings"
      );

    return response.data;
};