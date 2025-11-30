import API from "./api";

// Create a new ride (driver posts ride)
export const createRide = async (rideData) => {
  const { data } = await API.post("/rides/create", rideData);
  return data;
};

// Search rides
export const searchRides = async (filters) => {
  try {
    const { source, destination, date } = filters;

    // call backend with query params
    const { data } = await API.get("/rides/search", {
      params: { source, destination, date },
    });

    return data;
  } catch (error) {
    console.error("Error fetching rides:", error);
    return [];
  }
};

// Get rides posted by logged-in driver
export const getDriverRides = async () => {
  const { data } = await API.get("/rides/driver");
  return data;
};

// Book a ride
export const bookRide = async (rideId, seatsBooked, passengerName, phone, totalFare) => {
  return await API.post("/bookings/book", {
    rideId,
    seatsBooked,
    passengerName,
    phone,
    totalFare,
  });
};

// route matching: POST /api/rides/match
export const matchRides = async ({ source, destination, date }) => {
  const res = await API.post("/rides/match", { source, destination, date });
  return res.data;
};

export const cancelRide = async (rideId) => {
    // We expect a simple success/fail, so we might not need to return anything
    await API.post(`/rides/${rideId}/cancel`);
};

export const cancelBooking = async (bookingId) => {
    await API.delete(`/bookings/${bookingId}/cancel`);
};

