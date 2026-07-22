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

/* ===========================
   ATHLETE APIs
=========================== */

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
    { status },
    config
  );

  return response.data;
};

/* ===========================
   COACH APIs
=========================== */

export const getAllCoaches = async () => {
  const config = await getAdminConfig();

  const response = await api.get(
    "/admin/coaches",
    config
  );

  return response.data;
};

export const getCoachById = async (id) => {
  const config = await getAdminConfig();

  const response = await api.get(
    `/admin/coaches/${id}`,
    config
  );

  return response.data;
};

export const updateCoachStatus = async (
  id,
  status
) => {
  const config = await getAdminConfig();

  const response = await api.patch(
    `/admin/coaches/${id}/status`,
    { status },
    config
  );

  return response.data;
};

/* ===========================
   COACH ASSIGNMENT APIs
=========================== */

// Get all available (unassigned) athletes
export const getAvailableAthletes = async (coachId) => {
  const config = await getAdminConfig();

  const response = await api.get(
    `/admin/coaches/${coachId}/available-athletes`,
    config
  );

  return response.data;
};

// Get athletes assigned to a coach
export const getAssignedAthletes = async (coachId) => {
  const config = await getAdminConfig();

  const response = await api.get(
    `/admin/coaches/${coachId}/assigned-athletes`,
    config
  );

  return response.data;
};

// Assign one or more athletes to a coach
export const assignAthletesToCoach = async (
  coachId,
  athleteIds
) => {
  const config = await getAdminConfig();

  const response = await api.post(
    `/admin/coaches/${coachId}/assign`,
    {
      athleteIds,
    },
    config
  );

  return response.data;
};

// Remove an athlete from a coach
export const removeAssignedAthlete = async (
  coachId,
  athleteId
) => {
  const config = await getAdminConfig();

  const response = await api.delete(
    `/admin/coaches/${coachId}/remove/${athleteId}`,
    config
  );

  return response.data;
};