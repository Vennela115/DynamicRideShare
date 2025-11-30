// src/api/fareService.js
import API from "./api";

export const estimateFare = async ({ source, destination, passengers = 1 }) => {
  // GET /api/fares/estimate?source=...&destination=...&passengers=...
  const res = await API.get("/fare", {
    params: { source, destination, passengers },
  });
  return res.data;
};
