import React, { useState } from 'react'
import api from '../services/api'



export default function BookingModal({ ride, onClose, onBooked }) {
    const [seats, setSeats] = useState(1)
    const [loading, setLoading] = useState(false)
    const book = async () => {
        setLoading(true)
        try {
            const res = await api.post('/booking/book', { rideId: ride.id, seatsBooked: seats })
            onBooked(res.data)
        } catch (e) { alert(e?.response?.data?.message || 'Booking failed') }
        setLoading(false)
        onClose()
    }


    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
                <h3 className="text-lg font-semibold">Book ride</h3>
                <p className="text-sm text-slate-600">{ride.source} → {ride.destination} • {ride.date}</p>
                <div className="mt-4">
                    <label className="block text-sm">Seats</label>
                    <input type="number" min="1" max={ride.seatsAvailable} value={seats} onChange={e => setSeats(Number(e.target.value))} className="mt-1 block w-full border rounded px-3 py-2" />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={onClose} className="px-3 py-2 border rounded">Cancel</button>
                    <button onClick={book} disabled={loading} className="px-3 py-2 bg-indigo-600 text-white rounded">{loading ? 'Booking...' : 'Confirm'}</button>
                </div>
            </div>
        </div>
    )
}