import api from "../api/axios";

export const getVitalSigns =
  async () => {

    const response =
      await api.get(
        "/vital-signs"
      );

    return response.data;
};

export const createVitalSign =
  async (data) => {

    const response =
      await api.post(
        "/vital-signs",
        data
      );

    return response.data;
};

export const deleteVitalSign =
  async (id) => {

    const response =
      await api.delete(
        `/vital-signs/${id}`
      );

    return response.data;
};