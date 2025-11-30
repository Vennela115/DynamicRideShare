import API from "./api";

// Get all bookings for logged-in passenger
export const getMyBookings = async () => {
  const { data } = await API.get("/bookings/me");
  return data;
};
