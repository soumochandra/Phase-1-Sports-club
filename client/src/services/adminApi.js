import { auth } from "../config/firebase";
import api from "./api";

const getAdminToken = async () => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("Admin is not logged in");
  }

  return currentUser.getIdToken();
};

const getAdminConfig = async () => {
  const token = await getAdminToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllAthletes = async () => {
  const config = await getAdminConfig();

  const response = await api.get(
    "/admin/athletes",
    config
  );

  return response.data;
};

export const getAthleteById = async (id) => {
  const config = await getAdminConfig();

  const response = await api.get(
    `/admin/athletes/${id}`,
    config
  );

  return response.data;
};

export const updateAthleteStatus = async (
  id,
  status
) => {
  const config = await getAdminConfig();

  const response = await api.patch(
    `/admin/athletes/${id}/status`,
    {
      status,
    },
    config
  );

  return response.data;
};