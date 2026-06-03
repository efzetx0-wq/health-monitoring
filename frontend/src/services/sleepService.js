import api from "../api/axios";

export const getSleepTrackings =
  async () => {

    const response =
      await api.get(
        "/sleep-trackings"
      );

    return response.data;
};

export const createSleepTracking =
  async (data) => {

    const response =
      await api.post(
        "/sleep-trackings",
        data
      );

    return response.data;
};

export const deleteSleepTracking =
  async (id) => {

    const response =
      await api.delete(
        `/sleep-trackings/${id}`
      );

    return response.data;
};