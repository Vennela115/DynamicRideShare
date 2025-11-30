import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("passenger");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock login (replace with API)
    const userData = { email, role };
    login(userData);

    if (role === "driver") navigate("/driver");
    else navigate("/passenger");
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="passenger">Passenger</option>
          <option value="driver">Driver</option>
        </select>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
