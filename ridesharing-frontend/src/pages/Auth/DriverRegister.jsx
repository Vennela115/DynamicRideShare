import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import  useAuth from "../../hooks/useAuth"; // Assuming you have a useAuth hook

export default function DriverRegister() {
    const navigate = useNavigate();
    const { login } = useAuth(); // We'll use this to auto-login the user
    const [form, setForm] = useState({
        name: "", email: "", password: "", contact: "",
        licensePlate: "", vehicleModel: "", capacity: 4,
    });
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);
        try {
            const payload = { ...form, capacity: Number(form.capacity), role: "DRIVER" };
            await API.post("/auth/register", payload);
            
            // Auto-login the user to get a token for the next step
            await login({ email: form.email, password: form.password });

            // Redirect to the new verification page
            navigate("/driver/verify", { replace: true });

        } catch (e2) {
            setErr(e2?.response?.data?.message || "Registration failed. Please check details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-slate-900">Become a Driver</h1>
                <p className="text-slate-600 mt-2">
                    Complete the form below to create your driver account.
                </p>

                {err && <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{err}</div>}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {/* Personal Details Section */}
                    <div className="border-b pb-6">
                        <h2 className="text-lg font-semibold text-slate-800">Personal Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <InputField label="Full Name" name="name" value={form.name} onChange={handleChange} required />
                            <InputField label="Contact Number" name="contact" value={form.contact} onChange={handleChange} required />
                            <InputField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required />
                            <InputField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Vehicle Details Section */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">Vehicle Details</h2>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                            <InputField label="Vehicle Model" name="vehicleModel" value={form.vehicleModel} onChange={handleChange} placeholder="e.g., Honda City" required />
                            <InputField label="License Plate" name="licensePlate" value={form.licensePlate} onChange={handleChange} placeholder="e.g., AP01AB1234" required />
                            <InputField label="Seat Capacity" name="capacity" type="number" value={form.capacity} onChange={handleChange} min={1} max={8} required />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full rounded-lg bg-green-600 text-white py-3 font-semibold hover:bg-green-700 transition disabled:opacity-50">
                        {loading ? "Creating Account..." : "Continue to Verification"}
                    </button>
                </form>

                 <div className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link to="/driver/login" className="font-semibold text-green-600 hover:underline">
                        Login Here
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Reusable Input Field Component for a cleaner form
const InputField = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <input {...props} className="mt-1 w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500" />
    </div>
);
