import React, { useEffect, useState } from "react";
import { getProfile } from "../services/authService"; 
import { FaUserCircle, FaEnvelope, FaUserTag } from "react-icons/fa";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-600 animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center text-center">
          <FaUserCircle className="text-indigo-600 text-6xl mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">
            {profile.name || "User"}
          </h1>
          <p className="text-gray-500 mb-6">Welcome to your profile</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
            <FaEnvelope className="text-indigo-500 text-xl mr-4" />
            <span className="text-gray-700 font-medium">
              {profile.email || "Not Available"}
            </span>
          </div>
          <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
            <FaUserTag className="text-indigo-500 text-xl mr-4" />
            <span className="text-gray-700 font-medium uppercase">
              {profile.role || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
