import axios from "axios";

const API_URL =
  "http://127.0.0.1:8000/api";

const getToken = () => {

  return localStorage.getItem(
    "token"
  );
};

// GET PROFILE
export const getHealthProfile =
  async () => {

  const response =
    await axios.get(

      `${API_URL}/health-profile`,

      {
        headers: {
          Authorization:
            `Bearer ${getToken()}`
        }
      }
    );

  return response.data;
};

// SAVE PROFILE
export const saveHealthProfile =
  async (data) => {

  const response =
    await axios.post(

      `${API_URL}/health-profile`,

      data,

      {
        headers: {
          Authorization:
            `Bearer ${getToken()}`
        }
      }
    );

  return response.data;
};