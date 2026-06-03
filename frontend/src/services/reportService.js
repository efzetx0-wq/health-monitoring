import api from "../api/axios";

export const generateWeeklyReport =
  async () => {

    const response =
      await api.get(
        "/generate-weekly-report"
      );

    return response.data;
};