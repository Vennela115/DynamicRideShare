import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaStar } from 'react-icons/fa';
import API from '../services/api'; // Your central API instance

// Important for accessibility: Set the app element for the modal
Modal.setAppElement('#root');

const StarRating = ({ rating, setRating }) => {
    const [hover, setHover] = useState(null);
    return (
        <div className="flex space-x-1">
            {[...Array(5)].map((star, index) => {
                const currentRating = index + 1;
                return (
                    <label key={index}>
                        <input
                            type="radio"
                            name="rating"
                            value={currentRating}
                            onClick={() => setRating(currentRating)}
                            className="hidden"
                        />
                        <FaStar
                            className="cursor-pointer transition-colors"
                            size={30}
                            color={currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                            onMouseEnter={() => setHover(currentRating)}
                            onMouseLeave={() => setHover(null)}
                        />
                    </label>
                );
            })}
        </div>
    );
};

export default function ReviewModal({ isOpen, onRequestClose, bookingId, onReviewSubmit }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            await API.post('/reviews', {
                bookingId,
                rating,
                comment,
            });
            // Notify the parent component that submission was successful
            onReviewSubmit();
            onRequestClose(); // Close the modal
        } catch (err) {
            setError(err.response?.data?.message || 'Your review already submitted!');
        } finally {
            setLoading(false);
        }
    };
    
    // Custom styles for a modern modal appearance
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            border: 'none',
            borderRadius: '1rem',
            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%'
        },
        overlay: {
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)'
        },
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            contentLabel="Leave a Review"
        >
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Leave Your Feedback</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Your Rating</label>
                    <StarRating rating={rating} setRating={setRating} />
                </div>
                <div className="mb-6">
                    <label htmlFor="comment" className="block text-sm font-medium text-slate-700">
                        Add a comment (optional)
                    </label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="4"
                        className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="How was your experience?"
                    ></textarea>
                </div>
                {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onRequestClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
