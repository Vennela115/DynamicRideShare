import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaStar, FaCar, FaUser, FaCalendar, FaClock, FaRupeeSign, FaChair,FaSearch } from 'react-icons/fa';

const RideCard = ({ ride, isPartial = false, onBook }) => (
  <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isPartial ? "border-2 border-indigo-400" : ""}`}>
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">{ride.source}</p>
          <p className="text-2xl font-bold text-slate-800">↓</p>
          <p className="text-xl font-bold text-slate-800">{ride.destination}</p>
        </div>
        <div className="text-right">
          <p className="flex items-center justify-end text-lg font-bold text-slate-800">
            <FaRupeeSign className="mr-1" /> {ride.price}
          </p>
          <p className="text-sm text-slate-500">per seat</p>
        </div>
      </div>

      <div className="mt-4 border-t pt-4 space-y-3 text-sm text-slate-600">
        <p className="flex items-center"><FaCalendar className="mr-3 text-slate-400" /> {ride.date} at {ride.time ?? 'N/A'}</p>
        <p className="flex items-center"><FaUser className="mr-3 text-slate-400" /> {ride.driverName}</p>
        
        {/* --- RATING DISPLAY LOGIC --- */}
        <p className="flex items-center">
          <FaStar className="mr-3 text-slate-400" /> 
          <span className={`font-semibold ${ride.driverAverageRating > 0 ? 'text-amber-500' : 'text-slate-500'}`}>
            {ride.driverAverageRating > 0 ? ride.driverAverageRating.toFixed(1) : 'New Driver'}
          </span>
        </p>
        
        <p className="flex items-center"><FaChair className="mr-3 text-slate-400" /> {ride.seatsAvailable} seats available</p>
      </div>

      {isPartial && <p className="text-xs text-center font-semibold text-indigo-600 bg-indigo-50 p-2 rounded-md mt-4">This is a partial match on the driver's route.</p>}

    </div>
    <button
      onClick={() => onBook(ride)}
      className="w-full bg-green-500 text-white font-bold py-3 px-4 hover:bg-green-600 transition-colors"
    >
      Book Ride
    </button>
  </div>
);



export default function SearchRides() {
    const [results, setResults] = useState(null); // Start with null to differentiate from an empty search
    const [filters, setFilters] = useState({ source: "", destination: "", date: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const today = new Date().toISOString().split("T")[0];

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        // The date validation is no longer needed here, but you can keep the "future date" check
        if (filters.date && filters.date < today) {
            setError("Please select today or a future date.");
            return;
        }

        setLoading(true);
        setError(""); // Clear previous errors
        try {
            // Create a params object, but only include the date if it's been set.
            const params = {
                source: filters.source,
                destination: filters.destination,
            };
            if (filters.date) {
                params.date = filters.date;
            }
            
            const { data } = await API.get("/rides/search", { params });
            setResults(data);
        } catch (error) {
            console.error("Error fetching rides:", error);
            setError("Could not fetch rides. Please try again.");
            setResults({ direct: [], partial: [] }); // Set to empty on error
        } finally {
            setLoading(false);
        }
    };

    const handleBookRide = (ride) => {
        navigate("/book-ride", { state: { ride } });
    };

    const noResultsFound = results && results.direct.length === 0 && results.partial.length === 0;

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* --- REDESIGNED SEARCH FORM --- */}
                <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-slate-200">
                    <h1 className="text-2xl font-bold text-slate-800 mb-1">Find Your Next Ride</h1>
                    <p className="text-slate-500 mb-6">Enter your source and destination to begin.</p>
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700">From</label>
                            <input type="text" name="source" placeholder="e.g., Kadapa" value={filters.source} onChange={handleChange} className="mt-1 w-full p-3 border border-slate-300 rounded-lg shadow-sm" required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700">To</label>
                            <input type="text" name="destination" placeholder="e.g., Hyderabad" value={filters.destination} onChange={handleChange} className="mt-1 w-full p-3 border border-slate-300 rounded-lg shadow-sm" required />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-slate-700">Date</label>
                            <input type="date" name="date" value={filters.date} onChange={handleChange} className="mt-1 w-full p-3 border border-slate-300 rounded-lg shadow-sm" min={today} />
                        </div>
                        <button type="submit" className="md:col-span-5 w-full bg-indigo-600 text-white font-semibold p-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center text-lg">
                            <FaSearch className="mr-2" /> Search Rides
                        </button>
                    </form>
                    {error && <p className="text-center text-red-600 mt-4">{error}</p>}
                </div>

                {/* --- RESULTS SECTION --- */}
                {loading && <p className="text-center text-lg text-slate-500 animate-pulse">Finding best matches...</p>}
                
                {results && noResultsFound && (
                     <div className="text-center py-16 px-6 bg-white rounded-xl shadow-md">
                         <h3 className="mt-2 text-xl font-medium text-slate-900">No Rides Found</h3>
                         <p className="mt-1 text-slate-500">There are currently no rides matching your criteria. Try searching for a different route or date.</p>
                    </div>
                )}
                
                {results && !noResultsFound && (
                    <div className="space-y-8">
                        {results.direct.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">Direct Matches</h2>
                                <div className="grid gap-6">
                                    {results.direct.map((ride) => <RideCard key={ride.id} ride={ride} onBook={handleBookRide} />)}
                                </div>
                            </section>
                        )}
                        {results.partial.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">Partial Matches</h2>
                                <div className="grid gap-6">
                                    {results.partial.map((ride) => <RideCard key={ride.id} ride={ride} isPartial={true} onBook={handleBookRide} />)}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
