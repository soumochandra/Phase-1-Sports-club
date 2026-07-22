import axios from "axios";
import { auth } from "../config/firebase";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

export const getAllAthletes = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Admin is not logged in");
  }

  const token = await user.getIdToken();

  const response = await api.get("/admin/athletes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export default api;