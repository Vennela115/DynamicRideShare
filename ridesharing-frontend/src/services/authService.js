import API from "./api";

// Login as passenger/driver
export const loginUser = async (credentials) => {
  const { data } = await API.post("/auth/login", credentials);
  return data;
};

// Login as admin
export const loginAdmin = async (credentials) => {
  const { data } = await API.post("/auth/admin/login", credentials);
  return data;
};

// Register new user
export const registerUser = async (userData) => {
  const { data } = await API.post("/auth/register", userData);
  return data;
};

// ✅ Get logged-in user's profile
export const getProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in again.");

  const { data } = await API.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data; // { id, name, email, role }
};
