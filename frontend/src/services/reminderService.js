import api from "../api/axios";

export const getReminders = async () => {

  const response =
    await api.get("/reminders");

  return response.data;
};

export const createReminder = async (data) => {

  const response =
    await api.post(
      "/reminders",
      data
    );

  return response.data;
};

export const deleteReminder = async (id) => {

  const response =
    await api.delete(
      `/reminders/${id}`
    );

  return response.data;
};

export const updateReminder =
  async (id, data) => {

    const response =
      await api.put(
        `/reminders/${id}`,
        data
      );

    return response.data;
};