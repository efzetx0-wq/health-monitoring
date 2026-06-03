import api from "../api/axios";

export const getFoodDiaries =
  async () => {

    const response =
      await api.get(
        "/food-diaries"
      );

    return response.data;
};

export const createFoodDiary =
  async (data) => {

    const response =
      await api.post(
        "/food-diaries",
        data
      );

    return response.data;
};

export const deleteFoodDiary =
  async (id) => {

    const response =
      await api.delete(
        `/food-diaries/${id}`
      );

    return response.data;
};