import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/auth";

export const googleTestLogin = async () => {
  const response = await axios.post(
    `${API_URL}/google`,
    {
      token: "abc"
    }
  );

  return response.data;
};